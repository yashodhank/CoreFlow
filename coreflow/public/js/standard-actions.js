frappe.provide("CoreFlow.Actions");
frappe.provide('CoreFlow.Widgets');

CoreFlow.wit = function(it){
  // What Is This
  return Object.prototype.toString.call(it).match(/\[object\ ([a-zA-Z]+)\]/)[1]
}

CoreFlow.Actions.get_fields = function(filters){
	var docname = cur_frm.doc.document_type,
      fields = frappe.meta.get_docfields(docname, undefined, filters),
      ret = [], field;
  $.each(fields, function(i,df){
    field = {label: __(df.label), name: df.fieldname};
    if (in_list(['Link', 'Dinamic Link'], df.fieldtype)){
      field.query = df.options;
    }
    ret.push(field);
  });
  return ret;
}

CoreFlow.Actions.build_subfield = function(filters, subfield){
  var fields = CoreFlow.Actions.get_fields(filters);
  if (subfield && CoreFlow.wit(subfield)!=="Array"){
    subfield = [subfield];
    $.each(fields, function(i,df){
      df.fields = subfield;
    });
  }
  return fields;
}

CoreFlow.Actions.build_nested_fields = function(subfield, fieldType, nested, with_std){
  if (subfield && CoreFlow.wit(subfield)!=="Array"){
    subfield = [subfield];
  }
  return function(query){
    var fields = [];
    if (with_std){
      $.each(frappe.model.std_fields.concat(frappe.model.std_fields_table), function(i,v){
        fields.push({label: v.label, name: v.fieldname, fields: subfield});
      })
    }
    frappe.call({
      async: false,
      'method': 'coreflow.coreflow.doctype.document_flow.document_flow.get_docfields',
      'args': {
        'doctype': query,
        'subfields': subfield,
        'fieldtype': fieldType,
        'nested': nested,
      },
      'callback': function(r){
        if (r.exc){ throw r.exc; }
        $.each(r.message, function(i,f){
          f.fields=subfield;
          fields.push(f);
        })
        //fields.concat(r.message);
      }
    });
    return fields;
  }
}

CoreFlow.Actions.OPERATORS = [
  {label: __('Starts With'), name: 'startswith', fields: [
    {label: __('Value'), name: 'condition', fieldType: 'text'}
  ]},
  {label: __('Contains'), name: 'contains', fields: [
    {label: __('Value'), name: 'condition', fieldType: 'text'}
  ]},
  {label: __('Is in list'), name: 'inlist', fields: [
    {label: __('Values'), name: 'condition', fieldType: 'tags'}
  ]},
  {label: __('Is not in list'), name: 'notinlist', fields: [
    {label: __('Values'), name: 'condition', fieldType: 'tags'}
  ]},
  {label: __('Ends Width'), name: 'endswith', fields: [
    {label: __('Value'), name: 'condition', fieldType: 'text'}
  ]},
  {label: __('Is equal to'), name: 'equal', fields: [
    {label: __('Value'), name: 'condition_selector', fieldType: 'select', options: [
      {label: __('Value'), name: 'equalto_value', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'text'}
      ]},
      {label: __('Field'), name: 'equalto_field', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'select', options:
          CoreFlow.Actions.get_fields({fieldtype: ['not in', frappe.model.no_value_type]})
        }
      ]}
    ]}
  ]},
  {label: __('Is not equal to'), name: 'notequal', fields: [
    {label: __('Value'), name: 'condition_selector', fieldType: 'select', options: [
      {label: __('Value'), name: 'equalto_value', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'text'}
      ]},
      {label: __('Field'), name: 'equalto_field', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'select', options:
          CoreFlow.Actions.get_fields({fieldtype: ['not in', frappe.model.no_value_type]})
        }
      ]}
    ]}
  ]},
  {label: __('Is less than'), name: 'lessthan', fields: [
    {label: __('Value'), name: 'condition_selector', fieldType: 'select', options: [
      {label: __('Value'), name: 'equalto_value', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'text'}
      ]},
      {label: __('Field'), name: 'equalto_field', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'select', options:
          CoreFlow.Actions.get_fields({fieldtype: ['not in', frappe.model.no_value_type]})
        }
      ]}
    ]}
  ]},
  {label: __('Is less or equal to'), name: 'lessorequal', fields: [
    {label: __('Value'), name: 'condition_selector', fieldType: 'select', options: [
      {label: __('Value'), name: 'equalto_value', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'text'}
      ]},
      {label: __('Field'), name: 'equalto_field', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'select', options:
          CoreFlow.Actions.get_fields({fieldtype: ['not in', frappe.model.no_value_type]})
        }
      ]}
    ]}
  ]},
  {label: __('Is greather than'), name: 'greatherthan', fields: [
    {label: __('Value'), name: 'condition_selector', fieldType: 'select', options: [
      {label: __('Value'), name: 'equalto_value', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'text'}
      ]},
      {label: __('Field'), name: 'equalto_field', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'select', options:
          CoreFlow.Actions.get_fields({fieldtype: ['not in', frappe.model.no_value_type]})
        }
      ]}
    ]}
  ]},
  {label: __('Is greather or equal to'), name: 'greaterorequal', fields: [
    {label: __('Value'), name: 'condition_selector', fieldType: 'select', options: [
      {label: __('Value'), name: 'equalto_value', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'text'}
      ]},
      {label: __('Field'), name: 'equalto_field', fields: [
        {label: __('Value'), name: 'condition', fieldType: 'select', options:
          CoreFlow.Actions.get_fields({fieldtype: ['not in', frappe.model.no_value_type]})
        }
      ]}
    ]}
  ]}
];

CoreFlow.Actions.GLOBAL = [
  {label: __('Set filter on'), name: 'setLinkFilter', fields: [
    {
      label: __('Field name'), 
      name: 'target', 
      fieldType: 'select', 
      options: CoreFlow.Actions.build_nested_fields(
        {
          label: __("Field"),
          name: 'fieldname',
          fieldType: 'select',
          options: CoreFlow.Actions.build_nested_fields(
            {
              label: __('Target Field'),
              name: 'field_option',
              fieldType: 'select',
              options: CoreFlow.Actions.OPERATORS
            },
            undefined,
            undefined,
            true
          )
        },
        'Link',
        false
      )(function(){ return cur_frm.doc.document_type; })
    },
  ]},
  {label: __("Show field when"), name: "showField", fields: [
    {
      label: __('Field name'), 
      name: 'target', 
      fieldType: 'select', 
      options: CoreFlow.Actions.build_nested_fields(
        {
          label: __("Field"),
          name: 'fieldname',
          fieldType: 'select',
          options: CoreFlow.Actions.build_nested_fields(
            {
              label: __('Target Field'),
              name: 'field_option',
              fieldType: 'select',
              options: CoreFlow.Actions.OPERATORS
            },
            undefined,
            undefined,
            true
          )
        },
        '*',
        true
      )(function(){ return cur_frm.doc.document_type; })
    },
  ]},
  {label: __("Hide field when"), name: "hideField", fields: [
    {
      label: __('Field name'), 
      name: 'target', 
      fieldType: 'select', 
      options: CoreFlow.Actions.build_nested_fields(
        {
          label: __("Field"),
          name: 'fieldname',
          fieldType: 'select',
          options: CoreFlow.Actions.build_nested_fields(
            {
              label: __('Target Field'),
              name: 'field_option',
              fieldType: 'select',
              options: CoreFlow.Actions.OPERATORS
            },
            undefined,
            undefined,
            true
          )
        },
        '*',
        true
      )(function(){ return cur_frm.doc.document_type; })
    },
  ]},
]

CoreFlow.Actions.ALL = [
	{label: __("Show Alert"), name: "alert", fields: [
    {label: "Message", name: "message", fieldType: "textarea"},
    {label: "Raise Error", name: "error", fieldType: "bool"}
  ]},
  {label: "Update Field", name: "updateField", fields: [
    {label: "Field", name: "fieldId", fieldType: "select", options: [
      {label: "Name to", name: "nameField", fields: [
        {label: "New Value", name: "newValue", fieldType: "text"}
      ]},
      {label: "Age to", name: "ageField", fields: [
        {label: "New Value", name: "newValue", fieldType: "text"}
      ]},
      {label: "Occupation to", name: "occupationField", fields: [
        {label: "New Value", name: "newValue", fieldType: "formula"}
      ]}
    ]},
  ]}
]

CoreFlow.Actions.LINK = [

]

CoreFlow.Widgets.Tags = function(wrapper, input, field){
  var tags = [];
  var $tag =  $('<ul></ul>', {'id': field.name});
  $tag.tagit({
    animate: false,
    allowSpaces: true,
    placeholderText: __("Add an option") + " ...",
    onTagAdded: function(ev, tag){
      var tag = tag.find('.tagit-label').text();
      tags.push(tag);
      input.val(tags.join(','));
    },
    onTagRemoved: function(ev, tag){
      var tag = tag.find('.tagit-label').text();
      tags.splice(tags.indexOf(tag), 1);
      input.val(tags.join(','));
    }
  });
  wrapper.append($tag);
  input.hide();
}