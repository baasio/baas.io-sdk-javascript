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

	root.Baas.ApiClient = apigee.ApiClient;
	root.Baas.QueryObj = apigee.QueryObj;
})(this);

(function(root){
	root.Baas = root.Baas || {};

	var Baas = root.Baas,
		ApiClient = Baas.ApiClient,
		QueryObj = Baas.QueryObj;

	/**
	* const
	*/
	Baas.PUBLIC_API_URL = 'http://devapi.baas.io:8080/';

	function _initApigeeSDK() {
		ApiClient.setApiUrl(Baas.PUBLIC_API_URL);
	}

	/**
	* public methods
	*/
	Baas.App = (function() {
		return {
			init: function(orgName, appName) {
				_initApigeeSDK();

				ApiClient.setApplicationName(appName);
				ApiClient.setOrganizationName(orgName);
			},

			loginUser: ApiClient.loginAppUser.bind(ApiClient),
			logoutUser: ApiClient.logoutAppUser.bind(ApiClient),
			createUser: ApiClient.createAppUser.bind(ApiClient),
			updateUser: ApiClient.updateAppUser.bind(ApiClient),
			deleteUser: function(uuid, data, successCallback, failureCallback) {
			    var data = data || {}
			    ApiClient.runAppQuery(new QueryObj('DELETE', 'users/'+uuid, data, null,
			      function (response) {
			        if (successCallback && typeof(successCallback) == "function") {
			          successCallback(response);
			        }
			      },
			      function (response) {
			        if (failureCallback && typeof(failureCallback) == "function") {
			          failureCallback(response);
			        }
			      }
			     ));
			},

			/**
			 * 나는 앱을 떠난다.
			 * TODO username 이 아닌 uuid 로, body 가 아닌 uri 로 넘겨야 한다.
			 */
			leave: function(options) {
				var path, options = options || {};

				path = 'users/'+ ApiClient.getAppUserUsername();

			    ApiClient.runAppQuery(new QueryObj('DELETE', path, null, null,
			      options.success,
			      options.error
		        ));	
			}
		}
	}());

})(this);	