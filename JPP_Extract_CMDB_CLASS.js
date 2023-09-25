// v0.1

var custom_tables = "false";			// Show only custom tables
var custom_attributes = "false";		// Show only custom attributes
var active_attributes = "false";		// Show only active attributes
var descendant_attributes = "true";		// Show only descendant attributes
var base_table = "cmdb_ci";				// Starting point
var output = [], line;
line = {
	level: String("Level"),
	table_label: String("Table Label"),
	table_name: String("Table Name"),
	table_extend: String("Extended From"),
	column_active: String("Column Active"),
	column_label: String("Column Label"),
	column_name: String("Column Name"),
	column_descendant: String("descendant"),
	column_type: String("Column Type"),
	column_reference: String("Reference Table"),
	column_mandatory: String("Mandatory"),
	column_readonly: String("Read Only"),
	column_display: String("Display")
}
output.push(line);


var sysDbObject = new GlideRecord("sys_db_object");
if (sysDbObject.get("name", base_table)) {
	var baseItem = {
		sysId: sysDbObject.getUniqueValue(),
		name: String(sysDbObject.name),
		label: String(sysDbObject.label),
		isExtendable: String(sysDbObject.is_extendable),
		level: 0
	};
	
	//Retrieve Attributes
	getAttributes(baseItem.name, baseItem.label, baseItem.level, "");
	
	// Retrieve child tables
	baseItem.children = getChildren(baseItem.sysId, baseItem.level);
}


var i;
var body = "";
body = "\n";
for (i = 0; i < output.length; i++) {
	
	if ((custom_tables == "true") && (output[i]['table_name'].startsWith("u_"))){
		//Show only custom tables
		body = body + output[i]['level'] + "|" + output[i]['table_label'] + "|" + output[i]['table_name'] + "|" + output[i]['table_extend'] + "|" + output[i]['column_active'] + "|" + output[i]['column_label'] + "|" + output[i]['column_name'] + "|" + output[i]['column_descendant'] + "|" + output[i]['column_type'] + "|" + output[i]['column_reference'] + "|" + output[i]['column_mandatory'] + "|" + output[i]['column_readonly'] + "|" + output[i]['column_display'] + "\n";
		
	}else if ((custom_tables == "true") && (output[i]['table_name'].startsWith("u_")) && (descendant_attributes == "true")){
		//Show only custom tables and descendant attributes
		body = body + output[i]['level'] + "|" + output[i]['table_label'] + "|" + output[i]['table_name'] + "|" + output[i]['table_extend'] + "|" + output[i]['column_active'] + "|" + output[i]['column_label'] + "|" + output[i]['column_name'] + "|" + output[i]['column_descendant'] + "|" + output[i]['column_type'] + "|" + output[i]['column_reference'] + "|" + output[i]['column_mandatory'] + "|" + output[i]['column_readonly'] + "|" + output[i]['column_display'] + "\n";
		
	}else if ((custom_tables == "true") && (output[i]['table_name'].startsWith("u_")) && (custom_attributes == "true") && (output[i]['column_name'].startsWith("u_"))){
		//Show only custom tables and custom attributes
		body = body + output[i]['level'] + "|" + output[i]['table_label'] + "|" + output[i]['table_name'] + "|" + output[i]['table_extend'] + "|" + output[i]['column_active'] + "|" + output[i]['column_label'] + "|" + output[i]['column_name'] + "|" + output[i]['column_descendant'] + "|" + output[i]['column_type'] + "|" + output[i]['column_reference'] + "|" + output[i]['column_mandatory'] + "|" + output[i]['column_readonly'] + "|" + output[i]['column_display'] + "\n";
		
	}else if ((custom_tables == "false") && (custom_attributes == "true") && (output[i]['column_name'].startsWith("u_"))) {
		//Show only custom attributes
		body = body + output[i]['level'] + "|" + output[i]['table_label'] + "|" + output[i]['table_name'] + "|" + output[i]['table_extend'] + "|" + output[i]['column_active'] + "|" + output[i]['column_label'] + "|" + output[i]['column_name'] + "|" + output[i]['column_descendant'] + "|" + output[i]['column_type'] + "|" + output[i]['column_reference'] + "|" + output[i]['column_mandatory'] + "|" + output[i]['column_readonly'] + "|" + output[i]['column_display'] + "\n";
		
	}else if ((custom_tables == "false") && (custom_attributes == "false") && (descendant_attributes == "true") && (output[i]['column_descendant'] == "false")) {
		//Show only descendant attributes
		body = body + output[i]['level'] + "|" + output[i]['table_label'] + "|" + output[i]['table_name'] + "|" + output[i]['table_extend'] + "|" + output[i]['column_active'] + "|" + output[i]['column_label'] + "|" + output[i]['column_name'] + "|" + output[i]['column_descendant'] + "|" + output[i]['column_type'] + "|" + output[i]['column_reference'] + "|" + output[i]['column_mandatory'] + "|" + output[i]['column_readonly'] + "|" + output[i]['column_display'] + "\n";
		
	}else if ((custom_tables == "false") && (custom_attributes == "false") && (descendant_attributes == "false")) {
		//All tables and attributes
		body = body + output[i]['level'] + "|" + output[i]['table_label'] + "|" + output[i]['table_name'] + "|" + output[i]['table_extend'] + "|" + output[i]['column_active'] + "|" + output[i]['column_label'] + "|" + output[i]['column_name'] + "|" + output[i]['column_descendant'] + "|" + output[i]['column_type'] + "|" + output[i]['column_reference'] + "|" + output[i]['column_mandatory'] + "|" + output[i]['column_readonly'] + "|" + output[i]['column_display'] + "\n";
	}
}
gs.print(body);

function getAttributes(table, label, level, parentTable){
	var descendant;
	
	var gr_attr = new GlideRecord("sys_dictionary");
	gr_attr.addQuery("name", table);
	if (active_attributes == "true") {
		gr_attr.addQuery("active","true");
	}
	gr_attr.addQuery("internal_type","!=","collection");
	gr_attr.order("column_label");
	gr_attr.query();
	while(gr_attr.next()){
		var td = GlideTableDescriptor.get(table);
		var ed = td.getElementDescriptor(gr_attr.element);
		if (ed.isFirstTableName() == false){
			descendant = "true";
		}else{
			descendant = "false";
		}
		
		line = {
			level: String(level),
			table_label: String(label),
			table_name: String(table),
			table_extend: String(parentTable),
			column_active: String(gr_attr.active),
			column_label: String(gr_attr.column_label),
			column_name: String(gr_attr.element),
			column_descendant: String(descendant),
			column_type: String(gr_attr.internal_type),
			column_reference: String(gr_attr.reference.getDisplayValue()),
			column_mandatory: String(gr_attr.mandatory),
			column_readonly: String(gr_attr.read_only),
			column_display: String(gr_attr.display)
		}
		output.push(line);
	}
}

function getChildren (parentSysId, parentLevel) {
	var children = new GlideRecord("sys_db_object");
	children.addQuery("super_class", parentSysId);
	children.orderBy("label");
	children.query();
	var items = [], item;
	while (children.next()) {
		item = {
			sysId: children.getUniqueValue(),
			name: String(children.name),
			label: String(children.label),
			isExtendable: String(children.is_extendable),
			parentTable : String(children.super_class.getDisplayValue()),
			level: parentLevel + 1
		};
		items.push(item);
		
		getAttributes(item.name, item.label, item.level, item.parentTable);
		
		
		if (String(children.is_extendable) === "true") {
			item.children = getChildren(item.sysId, item.level);
		}
		
	}
	return items;
}
