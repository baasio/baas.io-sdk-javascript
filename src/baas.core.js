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
	Baas.PUBLIC_API_URL = 'http://devapi.baas.io/';

	Baas.ORGANZAITON_NAME;
	Baas.ORGANZAITON_UUID;

	Baas.APPLICATION_NAME;

	var APP_UUID,
		APP_ACCESS_TOKEN,
		APP_EXPIRES_IN = 3600;


	function _initApigeeSDK() {
		ApiClient.setApiUrl(Baas.PUBLIC_API_URL);
	}

	function successHandler(res) {
		Baas.APP_ACCESS_TOKEN = res.access_token;
		Baas.APP_UUID = res.application;
		Baas.APP_EXPIRES_IN = res.expires_in;

        Baas.trigger('credential_success', res, this);
	}

	function errorHandler(res) {
        Baas.trigger('credential_fail', res, this);
	}
	/**
	* public methods
	*/

	_.extend(Baas, Baas.Events, {

		app: function(orgName, appName) {
			_initApigeeSDK();

			ApiClient.setApplicationName(appName);
			ApiClient.setOrganizationName(orgName);
		},

		/*
		 *  A method to set up the Baas with Application Client ID and Client Secret Key
		 *  @method init
		 *  @public
		 *  @param {string} clientId
		 *  @param {string} clientSecret
		 *  @return none
		 *
		 */
		credential: function(clientId, clientSecret) {
			var self = ApiClient;
		    var data = {"client_id": clientId, "client_secret": clientSecret, "grant_type": "client_credentials"};
		    ApiClient.runAppQuery(new QueryObj('GET', 'token', null, data, successHandler, errorHandler));
		},

		/**
		 */
		login: function() {
			function successHandler(res) {
				console.log(res);

				Baas.APP_ACCESS_TOKEN = res.access_token;
				Baas.APP_UUID = res.application;
				Baas.APP_EXPIRES_IN = res.expires_in;
			}

			function errorHandler(res) {
				console.log(res);
			}
		}
	});

})(this);	