frappe.provide('CoreFlow.Operators');

CoreFlow.Operators.ALL = [
	{name: "present", label: __("is present"), fieldType: "none"},
	{name: "blank", label: __("is blank"), fieldType: "none"},
]

CoreFlow.Operators.BOOL = [
	{name: "truth", label: __("is true"), fieldType: "none"},
	{name: "falsity", label: __("is false"), fieldType: "none"},
]

CoreFlow.Operators.TEXT = [
	{name: "equalTo", label: __("is equal to"), fieldType: "text"},
	{name: "notEqualTo", label: __("is not equal to"), fieldType: "text" },
	{name: "includes", label: __("contains"), fieldType: "text"},
	{name: "matchesRegex", label: __("matches regex"), fieldType: "text"}
];

CoreFlow.Operators.NUMERIC = [
	{name: "equalTo", label: __("is equal to"), fieldType: "text"},
	{name: "notEqualTo", label: __("is not equal to"), fieldType: "text" },
	{name: "lessThan", label: __("is less than"), fieldType: "text"},
	{name: "lessThanEqual", label: __("is less than or equal to"), fieldType: "text"},
	{name: "greatherThan", label: __("is greather than"), fieldType: "text"},
	{name: "greatherThanEqual", label: __("is greather than or equal to"), fieldType: "text"}
];

CoreFlow.Operators.get_operators = function(datatype){
	datatype = (datatype || '').toLowerCase().replace(/ /gi, "");
	var textRegex = /text/gi,
		linkRegex = /link/gi,
		dateRegex = /date/gi;
	ret = [].concat(datatype==='check'? CoreFlow.Operators.BOOL : CoreFlow.Operators.ALL);
	switch (true){
		case (in_list(['data', 'code', 'select'], datatype) || textRegex.test(datatype) || linkRegex.test(datatype)):
			ret = ret.concat(CoreFlow.Operators.TEXT);
			break;
		case (in_list(['currency', 'float', 'percent', 'int'], datatype) || dateRegex.test(datatype)):
			ret = ret.concat(CoreFlow.Operators.NUMERIC);
			break;
	}
	return ret;
}