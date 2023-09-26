function jppOpenGraph(){
	var uiPageSysId = '87fe1e814765311077101cfe826d431e'; // pass ui page sys_id here
	var url = '/ui_page.do?sys_id=' + uiPageSysId;
	url+='&sysparm_kb=' + g_form.getUniqueValue();
	g_navigation.open(url, '_blank');
}
