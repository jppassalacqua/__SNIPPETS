(function executeRule(current, previous /*null when async*/ ) {

// en cours : faux pour le moment 


    function updateDiagnosticKnowledge(current_sys_id) {
		gs.addInfoMessage('JPP_DiagnosticTree.updateDiagnosticKnowledge:'+current_sys_id );
		
        var currentRecord = new GlideRecord('kb_knowledge');
		currentRecord.get(current_sys_id);
		if( 'Diagnostic' == currentRecord.topic ){
			gs.addInfoMessage('JPP_DiagnosticTree.updateDiagnosticKnowledge:recordfound:'+currentRecord.topic );

			var gr = new GlideRecord("u_m2m_kb_knowledge_kb_knowledge");
			gr.addQuery("u_kb_knowledge_child", current_sys_id);
			gr.query();
			gr.orderBy('u_kb_knowledge_parent.u_order');
			var html = "";
			while (gr.next()) {
				var number = gr.u_kb_knowledge_parent.number;
				var short_description = gr.u_kb_knowledge_parent.short_description;
				html += '\n' + '<div><a href="kb_view.do?sysparm_article=' + number + '" target="_blank" rel="nofollow noopener noreferrer">' + short_description + '</a></div>';
			}
			currentRecord.text = currentRecord.u_html_description + html;
			currentRecord.update();
		};		
    }

    // update current
	gs.addInfoMessage('JPP_DiagnosticTree.updateDiagnosticKnowledge:updatecurrent:'+current.sys_id );
    updateDiagnosticKnowledge(current.sys_id);

    // update parent(s)
    var gr2 = new GlideRecord("u_m2m_kb_knowledge_kb_knowledge");
    gr2.addQuery("u_kb_knowledge_parent", current.sys_id);
    gr2.query();
    while (gr2.next()) {
		gs.addInfoMessage('JPP_DiagnosticTree.updateDiagnosticKnowledge:update_parent:'+gr2.u_kb_knowledge_child );
        updateDiagnosticKnowledge(gr2.u_kb_knowledge_child);
    }

})(current, previous);
