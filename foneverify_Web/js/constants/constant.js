FvVariables = function() {
	return {
		messageRegrex : new RegExp("_", "g"),
		otpUpdateTimer : 5,
		intervalTimer : null,
		intervalForTimeout : null,
		isDidCheck : false,
		didToBeDisplayed : null,
		baseURL : 'http://52.7.158.185:8080/U2opia_Verify/v1.0/trial/',
		smsAPI : 'sms',
		voiceAPI : 'voice',
		selectedCallFlow : 0,
		postDataForVerificationReq : {},
		urlForVerificationReq : '',
		postData : {},
		otpCountDown : 90,
		intervalForUpdateReq : null,
		currentScreen : "",
		verificationId : "",
		headerConfiguration : {},
		appSecretKey : 'xxxx',
		customerId : 'yyy',
		endpoint : 'sms'
	};
}();
// For SMS/VOICE
// appSecretKey : '8c83fde9bd3f92cdb821faac7226891d',

FvAlerts = function() {
	return {
		"USER NOT FOUND" : "Username or Password is invalid. Please try again",
		"OTP_VERIFICATION_FALLBACK" : "You have entered wrong OTP. We have sent a new OTP.",
		"WRONG_OTP_PROVIDED" : " You have entered wrong OTP. Please enter the correct OTP or press resend OTP.",
		"MSISDN_VERIFICATION_PENDING" : "You have entered wrong OTP. Please enter the correct OTP or press resend OTP.",
		"ERROR_IN_OTP_VERIFICATION" : "Some error has occured. Please try again later.",
		"Success" : " OTP has been verified successfully.",
		"APP_DETAILS_UPDATED" : " App details have been updated successfully.",
		"INVALID_EMAIL_PROVIDED" : "Please provide valid email address.",
		"INVALID_SERVICE_CODE" : "Email link has expired or already used.",
		"REQUEST_ALREADY_EXIST" : "Email is already sent. Please check your mailbox.",
		"EMAIL_ALREADY_EXISTS" : "This email already exists.",
		"PAYMENT_REQUEST_TIMEDOUT" : "Payment request timeout.",
		"WRONG_OTP" : "Wrong OTP - Please try again.",
		"SUCCESS_VERIFICATION" : "Verification successful !",
		"VERIFICATION_OK_TEXT" : 'Clicking Ok will close the pop up.',
		"VERIFICATION_FAILED" : "Verification failed !",
		"SYSTEM_ERROR" : "System Error - Please try again later.",
		"DID_MESSAGE" : 'Please give a missed call to the above mentioned DID and click submit.',
		"PRICE_TEXT_FOR_INDIA" : '*Price applicable for verification in India only<br/>For international verifications charges of $0.09 apply.',
		"PRICE_TEXT_FOR_INDIA_2" : "Please get in touch with <a id='emailToSales' href='mailto:sales@foneverify.com'  class='color-main2 underline'>sales@foneverify.com</a>,<br/>pertaining to any query regarding the purchase.",
		"PAY_FLOW_TEXT" : "For any pricing related queries, contact us on <a href='skype:foneverify?chat' class='color-main2 underline'>Skype</a>  or mail us at <a id='emailToSales' href='mailto:sales@foneverify.com' class='color-main2 underline'>sales@foneverify.com</a>.",
		"VERIFICATION_REPORT_NOTFOUND" : "No verification done in the provided dates",
		"VERIFICATION_REPORT_APPID_NULL" : "App name should note be blank",
		"VERIFICATION_REPORT_COUNTRY_NULL" : "No country list exists for selected App List",
		"SOCIAL_LOGIN_EMAIL_NOT_FOUND" : "Registration was unsuccessful due to privacy constraints. Please register with a different account."
	};
}();

