
from __future__ import unicode_literals
import frappe

from frappe.utils import cint, flt
from inspect import getargspec

class RuleEngine(object):
	def __init__(self, rule):
		self.rule = rule or {}
		self.operators = {}
		self.actions = rule.get('actions', [])
		self.conditions = rule.get('conditions', {'all': {}})
		
	def __call__(self, conditionsAdapter, actionsAdapter):
		result = self.matches(conditionsAdapter)
		if result:
			self.runActions(conditionsAdapter)
		return result

	def matches(conditionsAdapter):
		try:
			result = self.handleNode(this.conditions, conditionsAdapter, self)
		except Exception, error
			frappe.throw(error)

		return result

	def operator(self, name):
		return self.operators[name]

	def runActions(self, actionsAdapter):
		for action_data in self.actions:
			action = actionsAdapter.get(action.get('value', ''), None)
			if action:
				action(Finder(action_data))

	def handleNode(self, node, ctx, callback=None):
		if node.has_key('all') or node.has_key('any') or node.has_key('none'):
			self.handleConditionalNode(node, ctx, callback)
		else:
			self.handleRuleNode(node, ctx, callback)

	def handleConditionalNode(self, node, ctx, callback=None):
		is_all, is_any, is_none = node.has_key('all'), node.has_key('any'), node.has_key('none') 
		try:
			nodes = node.get('all', node.get('any', node.get('none', [])))
			if not nodes:
				if callback and callable(callback):
					return callback(True)
				return True
			i, j = 0 ,len(nodes)

			def _next(engine=self):
				try: 
					if i < j:
						current_node = nodes[i]
						i += 1
						engine.handleNode(current_node, ctx, done)
					else:
						ret = True if is_none else is_all
						if callback and callable(callback):
							return callback(None, ret)
						return ret
				except Exception, error:
					frappe.throw(error)

			def done(result):
				if callback and callable(callback):
					if is_all and not result:
						return callback(False)
					elif is_any and result or not result:
						return  callback(True)
					elif is_none and not result:
						return callback(False)
				_next()
		except Exception, error:
			frappe.throw(error)

	def handleRuleNode(self, node, ctx, callback=None):
		try:
			value = ctx.get(node['name'])
			if value and callable(value):
				if  hasattr(value, 'func_code') and "callback" in value.func_code.co_varnames:
					def _inner(result, engine=self):
						engine.compareValues(result, node["operator"], node["value"], callback)
					return value()
				else:
					value = value()
			self.compareValues(value, node["operator"], node.value, callback)
		except Exception, error:
			frappe.throw(error)

	def compareValues(self, actual, operator, value, callback=None):
		try:
			operator_fn = self.operator(operator)
			if not operator:
				frappe.throw('Missing {0} operator'.format(operator))
			operator_fn(actual, value, callback)
		except Exception, error:
			frappe.throw(error)

class Finder(object):
	def __init__(self, data):
		self.data = data

	def __call__(self, *names):
		current_node = self.data
		for name in names:
			current_node = self.findByName(name, current_node)
			if not current_node:
				return None
		return current_node['value']

	@staticmethod
	def findByName(name, node):
		fields = node.get('fields', [])
		for field in fields:
			if field.get('name') == name:
				return field

