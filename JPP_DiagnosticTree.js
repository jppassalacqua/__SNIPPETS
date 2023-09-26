var JPP_DiagnosticTree = Class.create();
JPP_DiagnosticTree.prototype = {
    initialize: function() {},
    updateDiagnosticKnowledge: function(current_sys_id) {
        try {
            //gs.addInfoMessage('JPP_DiagnosticTree.updateDiagnosticKnowledge:' + current_sys_id);
            var currentRecord = new GlideRecord('kb_knowledge');
            currentRecord.get(current_sys_id);
            if ('Diagnostic' == currentRecord.topic) {
                //gs.addInfoMessage('JPP_DiagnosticTree.updateDiagnosticKnowledge:recordfound:' + currentRecord.topic);
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
                //gs.addInfoMessage('JPP_DiagnosticTree.updateDiagnosticKnowledge:record updated:' + currentRecord.number);
            }
        } catch (e) {
            gs.addInfoMessage('JPP_DiagnosticTree.updateDiagnosticKnowledge:error:' + e);
        }
    },
    updateParentDiagnosticKnowledge: function(current_sys_id) {
        try {
            var gr2 = new GlideRecord("u_m2m_kb_knowledge_kb_knowledge");
            gr2.addQuery("u_kb_knowledge_parent", current_sys_id);
            gr2.query();
            while (gr2.next()) {
                this.updateDiagnosticKnowledge(gr2.u_kb_knowledge_child);
                //gs.addInfoMessage('JPP_DiagnosticTree.updateParentDiagnosticKnowledge:record updated:' + gr2.u_kb_knowledge_child);
            }
        } catch (e) {
            gs.addInfoMessage('JPP_DiagnosticTree.updateParentDiagnosticKnowledge:error:' + e);
        }

    },
    getMermaidJsFromKB : function(current_sys_id){
		var strResult = "graph LR\n";
		strResult += this.getMermaidJsFromKB_RECURSE(current_sys_id);
		return strResult;
	},
	getMermaidJsFromKB_RECURSE : function(current_sys_id){
		var strResult = "";		
		var gr = new GlideRecord("u_m2m_kb_knowledge_kb_knowledge");
            gr.addQuery("u_kb_knowledge_child", current_sys_id);
            gr.query();
            while (gr.next()) {
				//strResult += 'click "/kb_view.do?sysparm_article=' + gr.getDisplayValue('u_kb_knowledge_child') + '" _blank';
				strResult += '\n';
				strResult += (gr.getDisplayValue('u_kb_knowledge_child'));
				strResult += ' --> ';
				strResult += (gr.getDisplayValue('u_kb_knowledge_parent'));
				strResult += '\n';
				strResult += (this.getMermaidJsFromKB(gr.getValue('u_kb_knowledge_parent')));
            }
		return strResult;
	},
    type: 'JPP_DiagnosticTree'
};
