$(function() {
	Util.stopSpinner();
	Util.hideRequestResponseDiv();
	$("#smsUpdateScreenDiv").load("html_templates/verificationRequest.html");
	$.getJSON('js/countries.json', function(json) {
		//$('#ccode').append('<option disabled selected value="">Select</option>');
		for (var i = 0; i < json.length; ++i) {
			$('#ccode').append($('<option>', {
				value : json[i].code,
				text : '+' + json[i].phoneCode
			}));
		}
	});
});

foneverify = function() {
	return {
		submitVerficationReqCall : function() {
			/*
			 * Initiated from Verification Request screen. This method submits the details on verification request screen.
			 */
			Util.startSpinner();
			var postData = {};
			var endpoint = FvVariables.endpoint;
			postData['customerId'] = FvVariables.customerId;
			postData['isoCountryCode'] = Util.isDefined($('#ccode').val()) ? ($('#ccode').val().toString()).toUpperCase() : '';
			postData['msisdn'] = $('#mobileNumber').val();
			postData['appKey'] = FvVariables.appSecretKey;
			FvVariables.selectedCallFlow = 2;
			FvVariables.postDataForVerificationReq = postData;
			var url = '';

			if (endpoint == 'sms') {
				url = FvVariables.baseURL + FvVariables.smsAPI;
			} else {
				url = FvVariables.baseURL + FvVariables.voiceAPI;
			}
			FvVariables.urlForVerificationReq = url;
			var url = FvVariables.urlForVerificationReq;
			$.ajax({
				type : 'POST',
				data : postData,
				async : true,
				url : url,
				success : function(data) {
					// In case its a success sms delivery or message already exists code ie 506
					if (data.responseCode == 200) {
						foneverify.resetRequestResponseDiv(postData, data, url);
						if (FvVariables.currentScreen == 'smsUpdateRequestScreen') {
							FvVariables.currentScreen = 'fallBackSmsScreen';
							foneverify.resetVerificationScreenDivCss('fallbackSmsScreenDiv');
							$("#fallbackSmsScreenDiv").load("html_templates/fallback_sms.html");
						} else {
							if (endpoint == 'sms') {
								FvVariables.currentScreen = 'smsUpdateRequestScreen';
								foneverify.resetVerificationScreenDivCss('smsUpdateScreenDiv');
								$("#smsUpdateScreenDiv").load("html_templates/sms_update_request.html");
							} else if (endpoint == 'voice') {
								$("#voiceUpdateScreenDiv").load("html_templates/voice_update_request.html");
								FvVariables.currentScreen = 'voiceUpdateRequestScreen';
								foneverify.resetVerificationScreenDivCss('voiceUpdateScreenDiv');
								FvVariables.isDidCheck = true;
								FvVariables.didToBeDisplayed = Util.isDefined(data.assignedDID) ? data.assignedDID : '';
								var statusVal = FvAlerts.DID_MESSAGE.toString();
								$('#messageText').fadeIn('slow');
								$('#messageText').text(Util.isDefined(statusVal) ? statusVal.indexOf("_") >= 0 ? statusVal.replace(FvVariables.messageRegrex, " ") : statusVal : FvAlerts.SYSTEM_ERROR);
								setTimeout(function() {
									$('#messageText').fadeOut(5000);
								}, 1900);
							} else {
								FvVariables.currentScreen = 'smsUpdateRequestScreen';
								foneverify.resetVerificationScreenDivCss('smsUpdateScreenDiv');
								$("#smsUpdateScreenDiv").load("html_templates/sms_update_request.html");
							}
						}
					} else if (data.responseCode == 504 || data.responseCode == 711) {
						Util.alert_message_verificatn_req('#alert_template_verifictn_req', Util.isDefined(data.errorMessage) ? data.errorMessage.indexOf("_") >= 0 ? data.errorMessage.replace(FvVariables.messageRegrex, " ") : data.errorMessage : FvAlerts.SYSTEM_ERROR);
					} else if (data.responseCode == 506) {
						var statusVal = Util.isDefined(data.verificationStatus) ? data.verificationStatus.toString() : Util.isDefined(data.errorMessage) ? data.errorMessage.toString() : FvAlerts.SYSTEM_ERROR;
						$('#messageText').fadeIn('slow');
						$('#messageText').text((Util.isDefined(statusVal) ? statusVal.indexOf("_") >= 0 ? statusVal.replace(FvVariables.messageRegrex, " ") : statusVal : FvAlerts.SYSTEM_ERROR) + ". PLEASE WAIT....");
						setTimeout(function() {
							$('#messageText').fadeOut(9000);
						}, 1000);
					} else {
						var statusVal = Util.isDefined(data.verificationStatus) ? data.verificationStatus.toString() : Util.isDefined(data.errorMessage) ? data.errorMessage.toString() : FvAlerts.SYSTEM_ERROR;
						$('#messageText').fadeIn('slow');
						$('#messageText').text(Util.isDefined(statusVal) ? statusVal.indexOf("_") >= 0 ? statusVal.replace(FvVariables.messageRegrex, " ") : statusVal : FvAlerts.SYSTEM_ERROR);
						setTimeout(function() {
							$('#messageText').fadeOut(9000);
						}, 1000);
					}
					setTimeout(function() {
						Util.stopSpinner();
					}, 1500);
				},
				error : function(xhr, status, error) {// if error occured
					Util.alert_message_verificatn_req('#alert_template_verifictn_req', FvAlerts.SYSTEM_ERROR);
					$('#alert_btn_div2').removeClass('disable_popup_btns_verif_req').addClass('enable_popup_btns_verif_req');
					Util.stopSpinner();
				}
			});
		},
		resetRequestResponseDiv : function(postData, data, url) {
			Util.showRequestResponseDiv();
			$('#verficationReqDetails').text('');
			$('#verficationRespDetails').text('');
			var postDataValue = "{";
			var responseData = "{ ";
			for (var key in postData) {
				currentVal = key + "=" + postData[key] + "&";
				postDataValue = postDataValue + currentVal;
			}
			postDataValue = postDataValue.substring(0, postDataValue.length - 2) + "}";
			for (var keyData in data) {
				currentVal = keyData + " : " + data[keyData] + " , ";
				responseData = responseData + currentVal;
			}
			responseData = responseData.substring(0, responseData.length - 2) + "}";
			postDataValue = 'curl "' + url + '" -X POST <br> --data "' + postDataValue + '"<br> --header "Content-Type: application/x-www-form-urlencoded"';

			$('#verficationReqDetails').append(postDataValue);
			$('#verficationRespDetails').append(responseData);
			FvVariables.verificationId = data.verificationId;
		},
		resetVerificationScreenDivCss : function(resetId) {
			$('#verificationRequestScreenDiv').css('display', 'none');
			$('#smsUpdateScreenDiv').css('display', 'none');
			$('#voiceUpdateScreenDiv').css('display', 'none');
			$('#fallbackSmsScreenDiv').css('display', 'none');
			//$('#verificationFailureScreenDiv').css('display', 'none');
			//$('#verificationSuccessScreenDiv').css('display', 'none');
			$('#' + resetId).css('display', 'block');
		},
		initTimerForVerificationReq : function() {
			console.log("initTimerForVerificationReq enter");
			clearInterval(FvVariables.intervalTimer);
			FvVariables.intervalTimer = null;
			clearInterval(FvVariables.intervalForTimeout);
			FvVariables.intervalForTimeout = null;
			clearInterval(FvVariables.intervalForUpdateReq);
			FvVariables.intervalForUpdateReq = null;
			$('#waiting_text').text("");
			verificationReqTimerSetting.setVerificationReqTimer.startTimer(FvVariables.otpCountDown);
			verificationReqTimerSetting.setVerificationReqTimer.startUpdateReqTimer(FvVariables.otpCountDown);
			setTimeout(function() {
				verificationReqTimerSetting.setVerificationReqTimer.checkForTimeout();
			}, 2000);
			// FvApis.getGuestDetails({
			// data : {
			// guiData : {
			// callback : FvApiCallbacks.getGuestDetailsApi.success
			// },
			// getPostData : FvApiCallbacks.getGuestDetailsApi.getPostData
			// }
			// });
			console.log("initTimerForVerificationReq exit");
		},
		verifySMSRequest : function() {
			$('.se-pre-con').css('display', 'block');
			foneverify.updateVerificationRequest();
		},
		updateVerificationRequest : function() {
			var postData = {};
			postData['customerId'] = FvVariables.currentScreen == 'smsUpdateRequestScreen' ? $('#customerIdSMS').val() : (FvVariables.currentScreen == 'fallBackSmsScreen' ? $('#customerIdFallback').val() : (FvVariables.currentScreen == 'voiceUpdateRequestScreen' ? $('#customerIdVoice').val() : $('#customerId').val()));
			postData['verificationId'] = FvVariables.currentScreen == 'smsUpdateRequestScreen' ? parseFloat($('#verificationIdSMS').val()) : (FvVariables.currentScreen == 'voiceUpdateRequestScreen' ? parseFloat($('#verificationIdVoice').val()) : parseFloat($('#verificationIdFallBack ').val()));

			if (FvVariables.isDidCheck == true) {
				if (FvVariables.currentScreen == 'voiceUpdateRequestScreen') {
					postData['appKey'] = $('#appSecretVoice').val();
					postData['did'] = $('#didNoVoice').val();
				} else if (FvVariables.currentScreen == 'fallBackSmsScreen') {
					postData['appKey'] = $('#appSecretFallback').val();
					postData['did'] = $('#didFallback').val();
				}
			} else {
				if (FvVariables.currentScreen == 'smsUpdateRequestScreen') {
					postData['appKey'] = $('#appSecretSMS').val();
				} else if (FvVariables.currentScreen == 'fallBackSmsScreen') {
					postData['appKey'] = $('#appSecretFallback').val();
				}
				postData['code'] = FvVariables.currentScreen == 'smsUpdateRequestScreen' ? $('#enterOtp').val() : (FvVariables.currentScreen == 'voiceUpdateRequestScreen' ? $('#enterOtp').val() : $('#enterOtpFallback').val());

			}
			//console.log("postData : " + postData);
			$.ajax({
				type : 'GET',
				data : postData,
				async : true,
				url : FvVariables.baseURL + 'update',
				success : function(data) {// callback method for further manipulations
					//FvConsts.otpCountDown = Util.isDefined(data.timeout) ? FvConsts.otpCountDown : FvConsts.otpCountDown;
					foneverify.resetRequestResponseDiv(postData, data, FvVariables.baseURL + 'update');
					// On successful verification code will be 200 and on successfully verified case code will be 703
					if (data.responseCode == 200 || data.responseCode == 703) {
						if (data.verificationStatus == 'VERIFICATION_COMPLETED' || data.verificationStatus == 'ALREADY_VERIFIED') {
							verificationReqTimerSetting.setVerificationReqTimer.clearAllInterval();
							verificationReqTimerSetting.setVerificationReqTimer.hideTimer();
							Util.alert_message_verificatn_req('#alert_template_verifictn_req', FvAlerts.SUCCESS_VERIFICATION);
						}
					} else if (data.responseCode == 707 || data.responseCode == 708 || data.responseCode == 709 || data.responseCode == 710 || data.responseCode == 708 || data.responseCode == 703 || data.responseCode == 702) {
						// In case of verification with error message code as mentioned above.
						var statusVal = data.verificationStatus.toString();
						$('#enterOtp').val('');
						$('#enterOtpFallback').val('');
						$('#messageText').fadeIn('slow');
						$('#messageText').text(Util.isDefined(statusVal) ? statusVal.indexOf("_") >= 0 ? statusVal.replace(FvVariables.messageRegrex, " ") : statusVal : FvAlerts.SYSTEM_ERROR);
						setTimeout(function() {
							$('#messageText').fadeOut(5000);
						}, 1000);
					} else if (data.responseCode == 706 || data.responseCode == 705 || data.responseCode == 701) {
						// In case of immediate fallback case with error code 706- TRYING_FALLBACK_SMS_NOT_DELIVERED or 705 - 	TRYING_FALLBACK_SMS_DELIVERED.
						verificationReqTimerSetting.setVerificationReqTimer.hideTimer();
						if (FvVariables.currentScreen == 'smsUpdateRequestScreen') {
							// disable submit button and enable switch to fallback button
							// $("#smsUpdateSpan1").css("display", 'none');
							// $("#smsUpdateSpan2").css("display", 'block');
							//Check if next Screen on fallback is SMS or Voice
							if ((Util.isDefined(data.smsCLI) && data.smsCLI == 'VERIFY') || (Util.isDefined(data.smsCli) || data.smsCli == 'VERIFY')) {
								FvVariables.isDidCheck = false;
							} else if (Util.isDefined(data.didAssigned)) {
								FvVariables.isDidCheck = true;
								FvVariables.didToBeDisplayed = data.didAssigned;
							}
							//switch to fallback
							foneverify.onSwitchToFallbackCall();
						} else if (FvVariables.currentScreen == 'voiceUpdateRequestScreen') {
							// disable submit button and enable switch to fallback button
							// $("#voiceUpdateSpan1").css("display", 'none');
							// $("#voiceUpdateSpan2").css("display", 'block');
							//Check if next Screen on fallback is SMS or Voice

							if ((Util.isDefined(data.smsCLI) && data.smsCLI == 'VERIFY') || (Util.isDefined(data.smsCli) || data.smsCli == 'VERIFY')) {
								FvVariables.isDidCheck = false;
							} else if (Util.isDefined(data.didAssigned)) {
								FvVariables.isDidCheck = true;
								FvVariables.didToBeDisplayed = data.didAssigned;
							}
							//switch to fallback
							foneverify.onSwitchToFallbackCall();
						} else if (FvVariables.currentScreen == 'fallBackSmsScreen') {

							//Display message popup on screen
							Util.alert_message_verificatn_req('#alert_template_verifictn_req', FvAlerts.VERIFICATION_FAILED);
							// Show text message in popup.
						}
						var statusVal = data.verificationStatus.toString();
						$('#messageText').fadeIn('slow');
						$('#messageText').text(Util.isDefined(statusVal) ? statusVal.indexOf("_") >= 0 ? statusVal.replace(FvVariables.messageRegrex, " ") : statusVal : FvAlerts.SYSTEM_ERROR);
						setTimeout(function() {
							$('#messageText').fadeOut(5000);
						}, 1000);
					} else {
						verificationReqTimerSetting.setVerificationReqTimer.clearAllInterval();
						verificationReqTimerSetting.setVerificationReqTimer.hideTimer();
						var statusVal = Util.isDefined(data.verificationStatus) ? data.verificationStatus.toString() : (Util.isDefined(data.errorMessage) ? data.errorMessage.toString() : "");
						Util.alert_message_verificatn_req('#alert_template_verifictn_req', Util.isDefined(statusVal) ? statusVal.indexOf("_") >= 0 ? statusVal.replace(FvVariables.messageRegrex, " ") : statusVal : FvAlerts.SYSTEM_ERROR);
					}
					setTimeout(function() {
						$('.se-pre-con').css('display', 'none');
					}, 1000);
				},
				error : function(xhr, status, error) {// if error occured
					$('#verficationReqDetails').append('');
					$('#verficationRespDetails').append('');
					verificationReqTimerSetting.setVerificationReqTimer.clearAllInterval();
					verificationReqTimerSetting.setVerificationReqTimer.hideTimer();
					Util.alert_message_verificatn_req('#alert_template_verifictn_req', Util.isDefined(error.errorMessage) ? error.errorMessage.indexOf("_") >= 0 ? error.errorMessage.replace(FvVariables.messageRegrex, " ") : error.errorMessage : FvAlerts.SYSTEM_ERROR);
					$('.se-pre-con').css('display', 'none');
				}
			});
		},
		onSwitchToFallbackCall : function() {
			$('.se-pre-con').css('display', 'block');
			FvVariables.currentScreen = 'fallBackSmsScreen';
			foneverify.resetVerificationScreenDivCss('fallbackSmsScreenDiv');
			$("#fallbackSmsScreenDiv").load("html_templates/fallback_sms.html");
			$('.se-pre-con').css('display', 'none');
		}
	};
}();

initFoneVerifyCall = function() {

	/*
	customerId:mo28udmd
	isoCountryCode:IN
	msisdn:9873490197
	appKey:8c83fde9bd3f92cdb821faac7226891d*/
	// FvVariables.appSecretKey = '8c83fde9bd3f92cdb821faac7226891d';
	$('#verificationReqBtn').on('click', foneverify.submitVerficationReqCall);

};

verificationReqTimerSetting = function() {
	return {
		setVerificationReqTimer : {
			showTimer : function() {
				if (FvVariables.currentScreen == 'smsUpdateRequestScreen') {
					$('#countDownSMS').show();
				} else if (FvVariables.currentScreen == 'fallBackSmsScreen') {
					$('#countDownFallBack').show();
				} else if (FvVariables.currentScreen == 'voiceUpdateRequestScreen') {
					$('#countDownVoice').show();
				}
			},
			startTimer : function(sec) {
				//console.log("startTimer enter");
				FvVariables.intervalTimer = setInterval(function() {
					var mi = Math.floor(sec / 60);
					if (mi.toString().length == 1) {
						mi = '0' + mi;
					}

					var ss = sec % 60;

					if (ss.toString().length == 1) {
						ss = '0' + ss;
					}
					verificationReqTimerSetting.setVerificationReqTimer.showTimer();
					if (FvVariables.currentScreen == 'smsUpdateRequestScreen') {
						Util.isDefined($('#countDownSMS')) ? $('#countDownSMS').text(mi + ':' + ss) : '';
					} else if (FvVariables.currentScreen == 'fallBackSmsScreen') {
						Util.isDefined($('#countDownFallBack')) ? $('#countDownFallBack').text(mi + ':' + ss) : '';
					} else if (FvVariables.currentScreen == 'voiceUpdateRequestScreen') {
						Util.isDefined($('#countDownVoice')) ? $('#countDownVoice').text(mi + ':' + ss) : '';
					}
					sec--;
					if (sec == -1) {
						clearInterval(FvVariables.intervalTimer);
						FvVariables.intervalTimer = null;
					}
				}, 1000);
			},
			checkForTimeout : function() {
				FvVariables.intervalForTimeout = setInterval(function() {
					if (FvVariables.currentScreen == 'smsUpdateRequestScreen') {
						if ($('#countDownSMS').text() == '00:00') {
							$('#waiting_text').text('WAITING....');
							// $("#smsUpdateSpan2").css("display", 'block');
							// clearInterval(FvVariables.intervalForTimeout);
							// FvVariables.intervalForTimeout = null;
							// onSwitchToFallbackCall();

						}
					} else if (FvVariables.currentScreen == 'fallBackSmsScreen') {
						if ($('#countDownFallBack').text() == '00:00') {
							$('#waiting_text').text('WAITING....');
							// clearInterval(FvVariables.intervalForTimeout);
							// FvVariables.intervalForTimeout = null;
							// Util.alert_message_verificatn_req('#alert_template_verifictn_req', FvAlerts.VERIFICATION_FAILED);
							// $('#alert_btn_div1').removeClass('disable_popup_btns_verif_req').addClass('enable_popup_btns_verif_req');
						}
					} else if (FvVariables.currentScreen == 'voiceUpdateRequestScreen') {
						if ($('#countDownVoice').text() == '00:00') {
							$('#waiting_text').text('WAITING....');
							// $("#voiceUpdateSpan2").css("display", 'block');
							// clearInterval(FvVariables.intervalForTimeout);
							// FvVariables.intervalForTimeout = null;
							// onSwitchToFallbackCall();
						}
					}
				}, 1000);
			},
			startUpdateReqTimer : function() {
				var timer = FvVariables.otpUpdateTimer * 1000;
				FvVariables.intervalForUpdateReq = setInterval(function() {
					//console.log("in start updatereqTimer : " + FvVariables.otpUpdateTimer);
					//console.log("in start updatereqTimer  FvVariables.otpCountDown : " + FvVariables.otpCountDown);
					if (FvVariables.otpUpdateTimer == FvVariables.otpCountDown) {
						//console.log("entered fallback cond when sec over **************************");
						clearInterval(FvVariables.intervalForUpdateReq);
						FvVariables.intervalForUpdateReq = null;
					} else {
						//console.log("send update request after every 20 sec or as provided by DB");
						//console.log("**************** GOing FOR update ********************");
						foneverify.updateVerificationRequest();
					}
				}, timer);
			},
			hideTimer : function() {
				if (FvVariables.currentScreen == 'smsUpdateRequestScreen') {
					$('#countDownSMS').css('display', 'none');
				} else if (FvVariables.currentScreen == 'fallBackSmsScreen') {
					$('#countDownFallBack').css('display', 'none');
				} else if (FvVariables.currentScreen == 'voiceUpdateRequestScreen') {
					$('#countDownVoice').css('display', 'none');
				}
			},
			clearAllInterval : function() {
				FvVariables.isDidCheck = false;
				clearInterval(FvVariables.intervalTimer);
				FvVariables.intervalTimer = null;
				clearInterval(FvVariables.intervalForTimeout);
				FvVariables.intervalForTimeout = null;
				clearInterval(FvVariables.intervalForUpdateReq);
				FvVariables.intervalForUpdateReq = null;
			}
		}
	};
}();

