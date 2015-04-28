from __future__ import unicode_literals
import re


def present(actual, target):
	return True if actual else False

def blank(actual, target):
	return not actual

def equalTo(actual, target):
	return actual == target

def notEqualTo(actual, target):
	return actual != target

def greatherThan(actual, target):
	return actual > target

def greatherThanEqual(actual, target):
	return actual >= target

def lessThan(actual, target):
	return actual < target

def lessThanEqual(actual, target):
	return actual <= target

def includes(actual, target):
	return target in actual

def matchRegex(actual, target):
	target = re.sub('^\/|\\$', "", target)
	re.match(target, actual)


STANDARD_OPERATORS = {
	'present': present,
	'blank': blank,
	'equalTo': equalTo,
	'notEqualTo': notEqualTo,
	'greatherThan': greatherThan,
	'greatherThanEqual': greatherThanEqual,
	'lessThan': lessThan,
	'lessThanEqual': lessThanEqual,
	'includes': includes,
	'matchRegex': matchRegex
}

from coreflow.coreflow.utils import memoize
from copy import deepcopy

@memoize
def build_operators(doctype, for_field, value_options=None):
	from coreflow.coreflow.doctype.document_flow.document_flow import get_options

	options = get_options(doctype, 
		{
			'*': [], 
			'std': ["=", True], 
			'nested': ['=', True], 
		}
	)

	options = filter(lambda x:x['name']!=for_field['name'], options)

	value_field = {
		'label': 'Value',
		'name': 'value'
	}
	if value_options:
		value_field['fieldType'] = 'select'
		value_field['options'] = deepcopy(value_options)
	else:
		value_field['fieldType'] = 'text'


	ret = [
		{'label': 'stars with', 'name': 'startswith', 'fields': [
			deepcopy(value_field)
		]},
		{'label': 'ends with', 'name': 'endswith', 'fields': [
			deepcopy(value_field)
		]},
		{'label': 'contains', 'name': 'contains', 'fields': [
			deepcopy(value_field)
		]},
		{'label': 'not contains', 'name': 'notcontains', 'fields': [
			deepcopy(value_field)
		]},
		{'label': 'is in list', 'name': 'inlist', 'fields': [
			{'label': 'Value', 'name': 'value', 'fieldType': 'tags'}
		]},
		{'label': 'is not in list', 'name': 'notinlist', 'fields': [
			{'label': 'Value', 'name': 'value', 'fieldType': 'tags'}
		]},
		{'label': 'is less than', 'name': 'islessthan', 'fields': [
			{'label': 'Option Selector', 'name':'value_or_field', 'fields': [
				deepcopy(value_field),
				{'label': 'Field', 'name': 'value', 'fieldType': 'select', 'options': deepcopy(options)}
			]}
		]},
		{'label': 'is less or equal to', 'name': 'islessorequal', 'fields': [
			{'label': 'Option Selector', 'name':'value_or_field', 'fields': [
				deepcopy(value_field),
				{'label': 'Field', 'name': 'value', 'fieldType': 'select', 'options': deepcopy(options)}
			]}
		]},
		{'label': 'is equal to', 'name': 'isequalto', 'fields': [
			{'label': 'Option Selector', 'name':'value_or_field', 'fields': [
				deepcopy(value_field),
				{'label': 'Field', 'name': 'value', 'fieldType': 'select', 'options': deepcopy(options)}
			]}
		]},
		{'label': 'is not equal to', 'name': 'isnotequalto', 'fields': [
			{'label': 'Option Selector', 'name':'value_or_field', 'fields': [
				deepcopy(value_field),
				{'label': 'Field', 'name': 'value', 'fieldType': 'select', 'options': deepcopy(options)}
			]}
		]},
		{'label': 'is greather than', 'name': 'greatherthan', 'fields': [
			{'label': 'Option Selector', 'name':'value_or_field', 'fields': [
				deepcopy(value_field),
				{'label': 'Field', 'name': 'value', 'fieldType': 'select', 'options': deepcopy(options)}
			]}
		]},
		{'label': 'is greather or equal to', 'name': 'greatherthanorequal', 'fields': [
			{'label': 'Option Selector', 'name':'value_or_field', 'fields': [
				deepcopy(value_field),
				{'label': 'Field', 'name': 'value', 'fieldType': 'select', 'options': deepcopy(options)}
			]}
		]},
		{'label': 'match with', 'name': 'matchwith', 'fields': [
			{'label': 'Value', 'name': 'value', 'fieldType': 'text'}
		]}
	]

	return ret