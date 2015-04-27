# -*- coding: utf-8 -*-
# Copyright (c) 2015, MaxMorais and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from coreflow.coreflow.utils import memoize
import json

COREFLOW_END = "// CoreFlow End"
COREFLOW_WARN = """
/* ATENTION:
  Never remove this section, it will be automaticaly 
  removed when you delete your CoreFlow Rules.
*/
"""
COREFLOW_START = "// CoreFlow Begin"

COREFLOW_ENGINE_TEMPLATE = """

frappe.ui.form.on("{document_type}", "{when}", function(frm){
	var actions = {actions},
		rules = {rules},
		engine = CoreFlow.RuleEngine(actions,rules);
	engine.run(frm.doc, CoreFlow.Actions.Adapter);
});

"""

class DocumentFlow(Document):
	def autoname(self):
		parts = [self.applied_to]
		if self.applied_to == 'Document':
			parts.append(self.document_type)
			parts.append(self.when)
			if self.when=='Change':
				self.parts.append(self.the_field)
		else:
			parts.append(self.workflow)
			parts.append(self.transition)

		self.name = '_'.join(map(lambda s: s.replace(' ', '_'), parts))

	def validate(self):
		""""""

	def on_save(self):

		if self.applied_to != "Document":
			return

		flows = frappe.get_all("Document Flow", fields="*", 
			filters = [
				["Document Flow", "applied_to", "=", self.applied_to],
				["Document Flow", "document_type", "=", self.document_type]
			]
		)

		if not self.custom_script:
			cs = frappe.new_doc("Custom Script")
			cs.doctype = self.document_type
		else:
			cs = frappe.get_doc("Custom Script", self.custom_script)

		if COREFLOW_END in cs.script or '':
			cs.script = cs.script.split(COREFLOW_END)[1];
		script = COREFLOW_START + COREFLOW_WARN + "\n"*2
		for flow in flows:
			when = flow["the_field"] if flow["when"] == "Change" else flow["when"].lower().replace(" ", "_")
			doctype = flow.document_type
			rules = "{none: []}"
			script += COREFLOW_ENGINE_TEMPLATE.format({
				"when": when,
				"doctype": doctype,
				"rules": rules,
				"actions": flow.get("actions", "[]")
			});
		script += COREFLOW_END
		cs.script = script + cs.script
		cs.save()
		if not self.custom_script:
			frappe.db.set_value(self.doctype, self.name, "custom_script", cs.name)

@frappe.whitelist()
def get_docfields(doctype, subfields=[], nested=False, fieldtype=None, show_hide=False):
	from frappe.model import no_value_fields
	except_fields = list(no_value_fields)
	ret = []
	pos = []

	if fieldtype == "*":
		nested = True
		show_hide = True

	if (nested):
		except_fields.pop(except_fields.index('Table'))
		ret.append({'label': doctype, 'group': True})

	filters = [
		['DocField', 'parent', '=', doctype]
	] 

	if fieldtype and fieldtype != "*":
		basetype = fieldtype	
		if fieldtype and not isinstance(fieldtype, (tuple, list, set)):
			basetype = [fieldtype]
		if not fieldtype:
			filters.append(['DocField', 'fieldtype', 'not in', except_fields])
		else:
			filters.append(['DocField', 'fieldtype', 'in', basetype])

	if not show_hide:
		filters.append(['DocField', 'hidden', '=', 0])

	fields = frappe.get_all('DocField', 
		fields=['fieldname', 'fieldtype', 'label', 'options'],
		filters=filters
	)

	print fieldtype, fieldtype=="*", len(fieldtype or '')
	if fieldtype=="*":
		print fieldtype, len(fields)
		print filters

	for field in fields:
		if field['fieldtype'] == 'Table':
			pos.append({'label': field["label"], 'group': True})
			pos.extend(get_docfields(field["options"], fieldtype=fieldtype))
		else:
			content = {'label': field["label"], 'name': field["fieldname"]}
			if field["fieldtype"] in ('Link', 'Dynamic Link'):
				content['query'] = field['options'] 
			#if field["fieldtype"] == "Select":
			#	content["options"] = build_select_options(field["options"], subfields)
			ret.append(content)

	if nested and pos:
		ret.extend(pos)

	return ret

@memoize
def get_options(doctype, filters=None, group_label="Doc"):
	from frappe.model import default_fields

	ret = []
	extras = []

	base_filters, show_nested, with_standard = get_filters(doctype, filters)
	
	fields = frappe.get_all(
		"DocField",
		fields = ['fieldname', 'fieldtype', 'label', 'options'],
		filters = base_filters
	)

	if with_standard:
		for df in default_fields:
			obj = {
				'doctype': doctype,
				'label': df,
				'name': df
			}
			
			if (group_label):
				obj['group'] = group_label

			ret.append(obj)

	for df in fields:
		obj = {
			'doctype': doctype,
			'label': df["label"] or df["fieldname"],
			'name': df["fieldname"]
		}
		if show_nested:
			if group_label:
				obj["group"] = group_label
			if df['fieldtype'] == 'Select':
				obj["options"] = get_select_options(df["options"])
			if df['fieldtype'] in ('Link', 'Dynamic Link'):
				obj["fields"] = [{"label": "Value", "name": "value", "fieldType": "link", "options": df.options}]
			if df['fieldtype'] == 'Table':
				extras.append(get_options(df['options'], group_label=(df.get("label") or df.get("fieldname"))))

		ret.append(obj)

	for extra in extras:
		ret.extend(extra)

	return ret

@memoize
def get_filters(parent, filters):
	except_fields = ['Column Break', 'Fold', 'Heading', 'HTML', 'Section Break']
	ret = [
		['DocField', 'parent', '=', parent]
	]

	show_hidden = 0
	show_nested = False
	show_all_types = False
	with_standard = False

	if isinstance(filters, dict):
		for field, options in filters.items():
			if field == '*':
				show_all_types = True
				continue;
			operator, condition = options
			if field == 'hidden' and condition:
				show_hidden = 1
				continue
			elif field == 'nested' and condition:
				show_nested = True
				continue
			elif field == 'std' and condition:
				with_standard = True
				continue
			ret.append(["DocField", field, operator, condition])
	elif isinstance(filters, (list, tuple, set)):
		for field, operator, condition in filters:
			if field == '*':
				show_all_types = True
				continue
			elif field == 'hidden' and condition:
				show_hidden = 1
				continue
			elif field == 'nested' and condition:
				show_nested = True
				continue
			elif field == 'std' and condition:
				with_standard = True
				continue
			ret.append(["DocField", field, operator, condition])
	
	if filters == '*' or show_all_types == True:
		show_hidden = 1

	if not show_hidden:
		ret.append(["DocField", 'hidden', '=', 0])
	
	if not show_nested:
		except_fields.append('Table')

	ret.append(['DocField', 'fieldtype', 'not in', except_fields])

	return ret, show_nested, with_standard

@memoize
def get_mapped_options(doctype):
	from coreflow.coreflow.std_operators import build_operators
	ret = []
	options = get_options(doctype, {'*': [], 'std': ['=', True], 'nested': ['=', True], })
	for i, option in enumerate(options):
		value_options = option.pop('options', None)
		option["fields"] = build_operators(doctype, option, value_options)
		ret.append(option)
	return ret

@memoize
def get_select_options(options):
	ret = []
	for option in (options or "").split("\n"):
		if not option: continue
		option = {"label": option, "value": option}
		ret.append(option)
	return ret