function getFormData($form){
    var serializedArray = $form.serializeArray();
    var formData = {};
    
    for(var index in serializedArray) {
    	if(formData[serializedArray[index].name]) {
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
		options.data = data;
	}
	
	$.ajax(options);
}

var cookie = {
		set: function (cname, cvalue, exdays) {
		    var d = new Date();
		    d.setTime(d.getTime() + (exdays*24*60*60*1000));
		    var expires = "expires="+ d.toUTCString();
		    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
			document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
		}
};
$(function(){
	$("#logoutBtn").click(function(){
		cookie.delete('jwt');
		location.assign("/admin/login");
	});
});