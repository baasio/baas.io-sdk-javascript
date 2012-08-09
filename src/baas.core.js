/*
 * BaaS.io JavaScript SDK
 * Version: 0.0.1
 * Built: 
 * http://baas.io
 * 
 * Copyright 2012 Baas, Inc.
 */

(function(root){
	root.Baas = root.Baas || {};
	root.Baas.VERSION = '0.0.1';
})(this);

(function(root){
	root.Baas = root.Baas || {};

	var Baas = root.Baas;

	/**
	 * const
	 */
	Baas.PUBLIC_API_URL = 'http://devapi.baas.io';

	Baas.ORGANZAITON_NAME;
	Baas.ORGANZAITON_UUID;

	Baas.APPLICATION_NAME;

	var APP_UUID,
		APP_ACCESS_TOKEN,
		APP_EXPIRES_IN = 3600;

	/**
	 * private methods
	 */

	function getManagementAPI() {
		return Baas.PUBLIC_API_URL +'/management/'+ Baas.ORGANZAITON_NAME +'/'+ Baas.APPLICATION_NAME +'/';
	}

	function getBaseAPI() {
		return Baas.PUBLIC_API_URL +'/'+ Baas.ORGANZAITON_NAME +'/'+ Baas.APPLICATION_NAME +'/';
	}

	

    /**
    *  @method encodeParams
    *  @purpose - to encode the query string parameters
    *  @params {object} params - an object of name value pairs that will be urlencoded
    *
    */
    function encodeParams(params) {
		tail = [];
		var item = [];
		if (params instanceof Array) {
			for (i in params) {
			  item = params[i];
			  if ((item instanceof Array) && (item.length > 1)) {
			    tail.push(item[0] + "=" + encodeURIComponent(item[1]));
			  }
			}
		} else {
			for (var key in params) {
			  if (params.hasOwnProperty(key)) {
			    var value = params[key];
			    if (value instanceof Array) {
			      for (i in value) {
			        item = value[i];
			        tail.push(key + "=" + encodeURIComponent(item));
			      }
			    } else {
			      tail.push(key + "=" + encodeURIComponent(value));
			    }
			  }
			}
		}
		return tail.join("&");
	}

	/**
	 * public methods
	 */

	/*
	 *  A method to set up the Baas with Application Client ID and Client Secret Key
 	 *  @method init
 	 *  @public
 	 *  @param {string} clientId
 	 *  @param {string} clientSecret
 	 *  @return none
 	 *
	 */
	Baas.initialize = function(orgName, appName, clientId, clientSecret) {
		Baas.ORGANZAITON_NAME = orgName;
		Baas.APPLICATION_NAME = appName;

		Baas.CLIENT_ID = clientId;
		Baas.CLIENT_SECRET = clientSecret;
	}

	Baas.login = function() {
		function successHandler(res) {
			console.log(res);

			Baas.APP_ACCESS_TOKEN = res.access_token;
			Baas.APP_UUID = res.application;
			Baas.APP_EXPIRES_IN = res.expires_in;
		}

		function errorHandler(res) {
			console.log(res);
		}

		Baas._request('token', 'GET', {
			grant_type: 'client_credentials',
			client_id: Baas.CLIENT_ID,
			client_secret: Baas.CLIENT_SECRET
		}, { success: successHandler, error: errorHandler });
	}

	Baas._ajaxIE8 = function(method, url, data, success, error) {
	    var xdr = new XDomainRequest();
	    xdr.onload = function() {
	      var response;
	      try {
	        response = JSON.parse(xdr.responseText);
	      } catch (e) {
	        if (error) {
	          error(xdr);
	        }
	      }
	      if (response) {
	        if (success) {
	          success(response, xdr);
	        }
	      }
	    };
	    xdr.onerror = xdr.ontimeout = function() {
	      error(xdr);
	    };
	    xdr.onprogress = function() {};
	    xdr.open(method, url);
	    xdr.send(data);
	};

	Baas._ajax = function(method, url, data, success, error) {
	    if (typeof(XDomainRequest) !== "undefined") {
	      return Baas._ajaxIE8(method, url, data, success, error);
	    }

	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function() {
	      if (xhr.readyState === 4) {
	        if (xhr.status >= 200 && xhr.status < 300) {
	          var response;
	          try {
	            response = JSON.parse(xhr.responseText);
	          } catch (e) {
	            if (error) {
	              error(xhr);
	            }
	          }
	          if (response) {
	            if (success) {
	              success(response, xhr);
	            }
	          }
	        } else {
	          if (error) {
	            error(xhr);
	          }
	        }
	      }
	    };
	    xhr.open(method, url, true);
	    xhr.setRequestHeader("Content-Type", "text/plain");  // avoid pre-flight.
	    xhr.send(data);
	};

	/**
	 * route is classes, users, login, etc.
	 * objectId is null if there is no associated objectId.
	 * method is the http method for the REST API.
	 * param is the payload as an object, or null if there is none.
	 * options is just a success/error callback hash.
	 * @ignore
	 */
	Baas._request = function(route, method, param, options) {
	    if (!Baas.CLIENT_ID || !Baas.CLIENT_SECRET) {
	      throw "You must specify your application ClientId and ClientSecret " +
	        "Baas.initialize";
	    }

	   	var url;

	    switch(route) {
	    	case 'a' : 
	    		url = getManagementAPI() + route;
	    		break;
	    	default :
	    		url = getBaseAPI() + route;
	    		break;
	    }
	    
	    // var url = Baas.PUBLIC_API_URL + "/1/" + route;
	    // if (className) {
	    //   url += "/" + className;
	    // }
	    // if (objectId) {
	    //   url += "/" + objectId;
	    // }

	    param = _.clone(param || {});
	    // if (method !== "POST") {
	    //   dataObject._method = method;
	    //   method = "POST";
	    // }
	    param.client_id = Baas.CLIENT_ID;
	    param.client_secret = Baas.CLIENT_SECRET;
	    // dataObject._ClientVersion = "js" + Parse.VERSION;
	    // Pass the session token on every request.
	    // var currentUser = Parse.User.current();
	    // if (currentUser && currentUser._sessionToken) {
	    //   dataObject._SessionToken = currentUser._sessionToken;
	    // }

	    url = url +'?'+ encodeParams(param);

	    Baas._ajax(method, url, param, options.success, options.error);
	};	

})(this);		