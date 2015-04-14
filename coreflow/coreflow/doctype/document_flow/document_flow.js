{% include "public/js/actions-builder.js" %}
{% include "public/js/conditions-builder.js" %}
{% include "public/js/standard-operators.js" %}
{% include "public/js/standard-actions.js" %}

cur_frm.cscript.onload = function(doc, cdt, cdn){
	cur_frm.fields_dict.document_type.get_query = function(doc, cdt, cdn){
		
	}
	cur_frm.fields_dict.the_field.get_query = function(doc, cdt, cdn){
		return {
			filters: [
				["DocField", "parent", "=", doc.document_type],
				["DocField", "fieldtype", "not in", frappe.model.no_value_type]
			]
		}
	}
	cur_frm.cscript.initialize_conditions();
	cur_frm.cscript.initialize_actions();
}

cur_frm.cscript.initialize_conditions = function(){
	var docfields = frappe.meta.get_docfields(
		cur_frm.doc.doctype, 
		cur_frm.doc.name, 
		{
			"fieldtype": [
				"not in", 
				frappe.model.no_value_type
				]
		}
	).sort(function(a,b){ return a.idx > b.idx ? 1 : a.idx === b.idx ? 0 : -1 }), fields = [];

	$.each(docfields, function(i,df){
		if (!df.hidden){
			fields.push(
				{
					label: __(df.label), 
					name: df.fieldname, 
					operators: CoreFlow.Operators.get_operators(
						df.fieldtype
					)
				}
			);
		}
	});

	cur_frm.fields_dict.rule_html.$wrapper.conditionsBuilder({
		fields: fields, data: JSON.parse(cur_frm.doc.rules || '{"all": []}')
	});
}

cur_frm.cscript.initialize_actions = function(){
    cur_frm.fields_dict.actions_html.$wrapper.actionsBuilder({
    	fields: CoreFlow.Actions.ALL
    });
}