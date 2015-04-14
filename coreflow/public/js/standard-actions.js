frappe.provide("CoreFlow.Actions");


CoreFlow.Actions.get_fields_in_context= function(){
	return []
}

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