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