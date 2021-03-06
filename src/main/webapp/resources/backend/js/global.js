var HttpStatus = {
	OK: 200,
	NO_CONTENT: 204,
	BAD_REQUEST:400,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500
};

var SubscriptionType = {
	FREE: 1,
	PAID: 2
};

var SubscriptionStatus = {
		PAYMENT_PENDING: 1,
		PARTIAL_PAYMENT: 2,
		INACTIVE: 3,
		EXPIRED: 4,
		ACTIVE: 5
	};

var TransactionStatus = {
		PAYMENT_PENDING: 1,
		PARTIAL_PAYMENT: 2,
		INACTIVE: 3,
		EXPIRED: 4,
		ACTIVE: 5
	};

function preValidate() {
	$('.msg').text('');
	$(':input').css('border-color', "");
}

function getFormData($form){
    var serializedArray = $form.serializeArray();
    var formData = {};
    
    for(var index in serializedArray) {
    	if(typeof(formData[serializedArray[index].name]) != 'undefined') {
    		if(!(formData[serializedArray[index].name] instanceof Array)) {
    			var tempVal = formData[serializedArray[index].name];
    			
    			formData[serializedArray[index].name] = [];
    			
    			formData[serializedArray[index].name].push(tempVal);
    		}
    		
    		formData[serializedArray[index].name].push(serializedArray[index].value);
    	} else {
    		formData[serializedArray[index].name] = serializedArray[index].value;
    	}
    }

    return formData;
}

function ajax(url, callback, method, data) {
	method = (method ? method.trim().toUpperCase() : 'GET');
	
	var options = {
		method: method,
		url: config.getServiceUrl(url),
		dataType: 'json',
		timeout: 10000,
		beforeSend: function (jqXHR) {
			var accessToken = cookie.get(config.ADMIN_AUTH_COOKIE_NAME);
			
			if(accessToken) {
				jqXHR.setRequestHeader('Authorization', 'Bearer ' + accessToken);
			}
		},
		success: function (data, textStatus, jqXHR) {
			callback(jqXHR, textStatus, data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			 if(jqXHR.responseJSON) {
				callback(jqXHR, textStatus, jqXHR.responseJSON);				
			} else if(jqXHR.errorThrown){
				callback(jqXHR, textStatus, {"form": errorThrown});				
			} else {
				callback(jqXHR, textStatus, {"form": "Oop's something went wrong!"});				
			}
		}
	};
	
	if(method == 'POST' || method == 'PUT') {
		if(typeof(data) == 'object') {
			options.contentType = 'application/json';
			
			options.data = JSON.stringify(data);
		} else {
			options.data = data;
		}
	}
	
	$.ajax(options);
}

function resetSelect(selector, optionText){
	if(optionText) {
		$(selector).html('<option value="">-' + optionText + '-</option>');
	} else {
		$(selector).html('<option value="">-Select-</option>');
	}
}

var cookie = {
		set: function (cname, cvalue, exdays) {
		    var d = new Date();
		    
		    d.setTime(d.getTime() + (exdays*24*60*60*1000));
		    
		    var expires = d.toUTCString();
		    
		    document.cookie = cname + "=" + cvalue + ";expires=" + expires + ";path=/";
		},
		get: function (cname) {
		    var name = cname + "=";
		    var decodedCookie = decodeURIComponent(document.cookie);
		    var ca = decodedCookie.split(';');
		    for(var i = 0; i <ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0) == ' ') {
		            c = c.substring(1);
		        }
		        if (c.indexOf(name) == 0) {
		            return c.substring(name.length, c.length);
		        }
		    }
		    return "";
		},
		delete: function(cname) {
			document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
		}
};

$(function(){
	$("#logoutBtn").click(function(){
		cookie.delete(config.ADMIN_AUTH_COOKIE_NAME);
		
		location.assign(config.ADMIN_LOGIN_URL);
	});
});

$(document).ajaxStart(function() {
	$(".container-fluid").fadeTo( "fast", 0.1 );
	$("#loader").css("display", "block");
});

$(document).ajaxComplete(function() {
	$(".container-fluid").fadeTo( "fast", 1 );
	$("#loader").css("display", "none");
});
