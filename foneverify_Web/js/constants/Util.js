Util = function() {
	return {
		startSpinner : function() {
			$('.se-pre-con').css('display', 'block');
		},
		stopSpinner : function() {
			$('.se-pre-con').css('visibility', 'hidden');
		},
		hideRequestResponseDiv : function() {
			$('#verification_req_resp_div').css('visibility', 'hidden');
		},
		showRequestResponseDiv : function() {
			$('#verification_req_resp_div').css('visibility', 'visible');
		},
		alert_message : function(elem, message) {
			$("#alert_message").html(message);
			$(elem).modal("show");
		},
		alert_message_verificatn_req : function(elem, message) {
			$("#alert_message").html(message);
			$('#alert_message_verificatn_req').modal("show");
		},

		isDefined : function(variable) {
			return variable !== null && typeof variable !== 'undefined';
		},
	};
}();
