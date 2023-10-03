(function executeRule(current, previous /*null when async*/) {

	// Add your code here
	function getToken(){
		gs.log("JPP  Quick Assignment Required.Get Token");
		var smGetToken = new sn_ws.RESTMessageV2("eSMS DEMO","Get Token");
		var response = smGetToken.execute();
		var httpResponseStatus = response.getStatusCode();  
		var responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
		var responseJSON = JSON.parse(responseBody);
		return responseJSON.access_token;
	}

	function sendSMS(email, mobile_phone){
		gs.log("JPP  Quick Assignment Required.Send SMS 2:" + current.subject + ':' + email+':'+mobile_phone);
		var smSendSMS = new sn_ws.RESTMessageV2("eSMS DEMO","Send SMS 2");
		smSendSMS .setRequestHeader("Accept","Application/json");
		smSendSMS .setRequestHeader("Authorization","Bearer "+getToken());
		smSendSMS .setStringParameter("recipient",mobile_phone);
		var rhtml = current.body.getDisplayValue();
		var txtDesc = rhtml.replace(/<\/?[^>]+(>|$)/g, " ").replace(/&nbsp;/g, " ");
		smSendSMS .setStringParameter("message",current.subject + ':' + email + ':' + txtDesc);
		var responseSendSMS = smSendSMS.execute();
		var httpResponseStatusSendSMS = responseSendSMS.getStatusCode();  
		var responseBodySendSMS = responseSendSMS.haveError() ? responseSendSMS.getErrorMessage() : responseSendSMS.getBody();
		gs.log("JPP  Quick Assignment Required:"+responseBodySendSMS );
	}
	
	var source_recipients = current.recipients;
	var aRecipients = source_recipients.split(';');
	for (var email in aRecipients) {
		var gr2 = new GlideRecord("sys_user");
		gr2.addQuery("email", aRecipients[email]);
		gr2.query();
		while (gr2.next()) {
			if ( "" != gr2.mobile_phone ){
				gs.log("JPP  Quick Assignment Required >>:"+aRecipients[email] + ':' + gr2.mobile_phone);
				sendSMS(aRecipients[email], gr2.mobile_phone);
			}
		}
	}

})(current, previous);
