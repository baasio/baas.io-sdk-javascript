var root = this;

var baasio = root.baasio || {};

// Current version.
baasio.VERSION = '0.1.0';

// AMD 모듈 방식 - require() -과 Node.js 모듈 시스템을 위한 코드 
if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = baasio;
	}

	exports.baasio = baasio;
} else {
	root.baasio = baasio;
}


baasio.ApiClient = (function () {
  //API endpoint
  var _apiUrl = "https://api.baas.io/";
  var _orgName = null;
  var _appName = null;
  var _token = null;
  var _callTimeout = 30000;
  var _queryType = null;
  var _loggedInUser = null;
  var _logoutCallback = null;
  var _callTimeoutCallback = null;


  function start(properties){
    if (properties.orgName) {
      this.setOrganizationName(properties.orgName);
    }
    if (properties.appName) {
      this.setApplicationName(properties.appName);
    }
    if (properties.timeoutValue) {
      this.setCallTimeout(properties.timeoutValue);
    }
  }

  /*
   *  A method to set up the ApiClient with orgname and appname
   *
   *  @method init
   *  @public
   *  @param {string} orgName
   *  @param {string} appName
   *  @return none
   *
   */
  function init(orgName, appName){
    this.setOrganizationName(orgName);
    this.setApplicationName(appName);
  }

  /*
  *  Public method to run calls against the app endpoint
  *
  *  @method runAppQuery
  *  @public
  *  @params {object} baasio.Query - {method, path, jsonObj, params, successCallback, failureCallback}
  *  @return none
  */
  function runAppQuery (Query) {
    var endpoint = "/" + this.getOrganizationName() + "/" + this.getApplicationName() + "/";
    // setQueryType(baasio.A);
    run(Query, endpoint);
  }

  /*
  *  Public method to run calls against the management endpoint
  *
  *  @method runManagementQuery
  *  @public
  *  @params {object} baasio.Query - {method, path, jsonObj, params, successCallback, failureCallback}
  *  @return none
  */
  function runManagementQuery (Query) {
    var endpoint = "/management/";
    // setQueryType(baasio.M);
    run(Query, endpoint)
  }

  /*
    *  A public method to get the organization name to be used by the client
    *
    *  @method getOrganizationName
    *  @public
    *  @return {string} the organization name
    */
  function getOrganizationName() {
    return _orgName;
  }

  /*
    *  A public method to set the organization name to be used by the client
    *
    *  @method setOrganizationName
    *  @param orgName - the organization name
    *  @return none
    */
  function setOrganizationName(orgName) {
    _orgName = orgName;
  }

  /*
  *  A public method to get the application name to be used by the client
  *
  *  @method getApplicationName
  *  @public
  *  @return {string} the application name
  */
  function getApplicationName() {
    return _appName;
  }

  /*
  *  A public method to set the application name to be used by the client
  *
  *  @method setApplicationName
  *  @public
  *  @param appName - the application name
  *  @return none
  */
  function setApplicationName(appName) {
    _appName = appName;
  }

  /*
  *  A public method to get current OAuth token
  *
  *  @method getToken
  *  @public
  *  @return {string} the current token
  */
  function getToken() {
    return _token;
  }

  /*
  *  A public method to set the current Oauth token
  *
  *  @method setToken
  *  @public
  *  @param token - the bearer token
  *  @return none
  */
  function setToken(token) {
    _token = token;
  }

  /*
   *  A public method to return the API URL
   *
   *  @method getApiUrl
   *  @public
   *  @return {string} the API url
   */
  function getApiUrl() {
    return _apiUrl;
  }

  /*
   *  A public method to overide the API url
   *
   *  @method setApiUrl
   *  @public
   *  @return none
   */
  function setApiUrl(apiUrl) {
    _apiUrl = apiUrl;
  }

  /*
   *  A public method to return the call timeout amount
   *
   *  @method getCallTimeout
   *  @public
   *  @return {string} the timeout value (an integer) 30000 = 30 seconds
   */
  function getCallTimeout() {
    return _callTimeout;
  }

  /*
   *  A public method to override the call timeout amount
   *
   *  @method setCallTimeout
   *  @public
   *  @return none
   */
  function setCallTimeout(callTimeout) {
    _callTimeout = callTimeout;
  }

  /*
   * Returns the call timeout callback function
   *
   * @public
   * @method setCallTimeoutCallback
   * @return none
   */
  function setCallTimeoutCallback(callback) {
    _callTimeoutCallback = callback;
  }

  /*
   * Returns the call timeout callback function
   *
   * @public
   * @method getCallTimeoutCallback
   * @return {function} Returns the callTimeoutCallback
   */
  function getCallTimeoutCallback() {
    return _callTimeoutCallback;
  }

  /*
   * Calls the call timeout callback function
   *
   * @public
   * @method callTimeoutCallback
   * @return {boolean} Returns true or false based on if there was a callback to call
   */
  function callTimeoutCallback(response) {
    if (_callTimeoutCallback && typeof(_callTimeoutCallback) === "function") {
      _callTimeoutCallback(response);
      return true;
    } else {
      return false;
    }
  }

  /*
   *  A public method to get the api url of the reset pasword endpoint
   *
   *  @method getResetPasswordUrl
   *  @public
   *  @return {string} the api rul of the reset password endpoint
   */
  function getResetPasswordUrl() {
    return getApiUrl() + "/management/users/resetpw"
  }

  /*
   *  A public method to get an Entity object for the current logged in user
   *
   *  @method getLoggedInUser
   *  @public
   *  @return {object} user - Entity object of type user
   */
  function getLoggedInUser() {
    return this._loggedInUser;
  }

  /*
   *  A public method to set an Entity object for the current logged in user
   *
   *  @method setLoggedInUser
   *  @public
   *  @param {object} user - Entity object of type user
   *  @return none
   */
  function setLoggedInUser(user) {
    this._loggedInUser = user;
  }

  /*
  *  A public method to log in an app user - stores the token for later use
  *
  *  @method logInAppUser
  *  @public
  *  @params {string} username
  *  @params {string} password
  *  @params {function} successCallback
  *  @params {function} failureCallback
  *  @return {response} callback functions return API response object
  */
  function logInAppUser (username, password, successCallback, failureCallback) {
    var self = this;
    var params = {"username": username, "password": password, "grant_type": "password"};
    this.runAppQuery(new baasio.Query('GET', 'token', null, params,
      function (response) {
        var user = new baasio.Entity('users');
        user.set('username', response.user.username);
        user.set('name', response.user.name);
        user.set('email', response.user.email);
        user.set('uuid', response.user.uuid);
        self.setLoggedInUser(user);
        self.setToken(response.access_token);
        if (successCallback && typeof(successCallback) === "function") {
          successCallback(response);
        }
      },
      function (response) {
        if (failureCallback && typeof(failureCallback) === "function") {
          failureCallback(response);
        }
      }
     ));
  }

  function logInWithFacebook (facebookToken, successCallback, failureCallback) {
    var self = this;
    var params = {fb_access_token: facebookToken};
    this.runAppQuery(new baasio.Query('GET', 'auth/facebook', null, params,
      function (response) {
        var user = new baasio.Entity('users');
        user.set('username', response.user.username);
        user.set('name', response.user.name);
        user.set('email', response.user.email);
        user.set('uuid', response.user.uuid);
        self.setLoggedInUser(user);
        self.setToken(response.access_token);
        if (successCallback && typeof(successCallback) === "function") {
          successCallback(response);
        }
      },
      function (response) {
        if (failureCallback && typeof(failureCallback) === "function") {
          failureCallback(response);
        }
      }
     ));
  }

  /*
   *  TODO:  NOT IMPLEMENTED YET - A method to renew an app user's token
   *  Note: waiting for API implementation
   *  @method renewAppUserToken
   *  @public
   *  @return none
   */
  function renewAppUserToken() {

  }

  /**
   *  A public method to log out an app user - clears all user fields from client
   *
   *  @method logoutAppUser
   *  @public
   *  @return none
   */
  function logoutAppUser() {
    this.setLoggedInUser(null);
    this.setToken(null);
  }

  /**
   *  A public method to test if a user is logged in - does not guarantee that the token is still valid,
   *  but rather that one exists, and that there is a valid UUID
   *
   *  @method isLoggedInAppUser
   *  @public
   *  @params {object} baasio.Query - {method, path, jsonObj, params, successCallback, failureCallback}
   *  @return {boolean} Returns true the user is logged in (has token and uuid), false if not
   */
  function isLoggedInAppUser() {
    var user = this.getLoggedInUser();
    return (this.getToken() && user.get('uuid'));
  }

   /*
   *  A public method to get the logout callback, which is called
   *
   *  when the token is found to be invalid
   *  @method getLogoutCallback
   *  @public
   *  @return {string} the api rul of the reset password endpoint
   */
  function getLogoutCallback() {
    return _logoutCallback;
  }

  /*
   *  A public method to set the logout callback, which is called
   *
   *  when the token is found to be invalid
   *  @method setLogoutCallback
   *  @public
   *  @param {function} logoutCallback
   *  @return none
   */
  function setLogoutCallback(logoutCallback) {
    _logoutCallback = logoutCallback;
  }

  /*
   *  A public method to call the logout callback, which is called
   *
   *  when the token is found to be invalid
   *  @method callLogoutCallback
   *  @public
   *  @return none
   */
  function callLogoutCallback() {
    if (_logoutCallback && typeof(_logoutCallback ) === "function") {
      _logoutCallback();
      return true;
    } else {
      return false;
    }
  }

  /**
   *  Private helper method to encode the query string parameters
   *
   *  @method encodeParams
   *  @public
   *  @params {object} params - an object of name value pairs that will be urlencoded
   *  @return {string} Returns the encoded string
   */
  function encodeParams (params) {
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

  /*
   *  A private method to get the type of the current api call - (Management or Application)
   *
   *  @method getQueryType
   *  @private
   *  @return {string} the call type
   */
  function getQueryType() {
    return _queryType;
  }
  /*
   *  A private method to set the type of the current api call - (Management or Application)
   *
   *  @method setQueryType
   *  @private
   *  @param {string} call type
   *  @return none
   */
  function setQueryType(type) {
    _queryType = type;
  }



  /**
   *  A private method to validate, prepare,, and make the calls to the API
   *  Use runAppQuery or runManagementQuery to make your calls!
   *
   *  @method run
   *  @private
   *  @params {object} baasio.Query - {method, path, jsonObj, params, successCallback, failureCallback}
   *  @params {string} endpoint - used to differentiate between management and app queries
   *  @return {response} callback functions return API response object
   */
  function run (Query, endpoint) {
    //validate parameters
    try {
      //verify that the query object is valid
      if(!(Query instanceof baasio.Query)) {
        throw(new Error('Query is not a valid object.'));
      }
      //for timing, call start
      Query.setQueryStartTime();
      //peel the data out of the query object
      var method = Query.getMethod().toUpperCase();
      var path = Query.getResource();
      var jsonObj = Query.getJsonObj() || {};
      var params = Query.getQueryParams() || {};

      //method - should be GET, POST, PUT, or DELETE only
      if (method != 'GET' && method != 'POST' && method != 'PUT' && method != 'DELETE') {
        throw(new Error('Invalid method - should be GET, POST, PUT, or DELETE.'));
      }

      //curl - append the bearer token if this is not the sandbox app
      var application_name = baasio.ApiClient.getApplicationName();
      if (application_name) {
        application_name = application_name.toUpperCase();
      }
      //if (application_name != 'SANDBOX' && baasio.ApiClient.getToken()) {
      if ( (application_name != 'SANDBOX' && baasio.ApiClient.getToken()) || (getQueryType() == baasio.M && baasio.ApiClient.getToken())) {
        Query.setToken(true);
      }

      //params - make sure we have a valid json object
      _params = JSON.stringify(params);
      if (!JSON.parse(_params)) {
        throw(new Error('Params object is not valid.'));
      }

      //add in the cursor if one is available
      if (Query.getCursor()) {
        params.cursor = Query.getCursor();
      } else {
        delete params.cursor;
      }

      //strip off the leading slash of the endpoint if there is one
      endpoint = endpoint.indexOf('/') == 0 ? endpoint.substring(1) : endpoint;

      //add the endpoint to the path
      path = endpoint + path;

      //make sure path never has more than one / together
      if (path) {
        //regex to strip multiple slashes
        while(path.indexOf('//') != -1){
          path = path.replace('//', '/');
        }
      }

      //add the http:// bit on the front
      path = baasio.ApiClient.getApiUrl() + path;

      //add in a timestamp for gets and deletes - to avoid caching by the browser
      if ((method == "GET") || (method == "DELETE")) {
        params['_'] = new Date().getTime();
      }

      //append params to the path
      var encoded_params = encodeParams(params);
      if (encoded_params) {
        path += "?" + encoded_params;
      }

      //jsonObj - make sure we have a valid json object
      jsonObj = JSON.stringify(jsonObj)
      if (!JSON.parse(jsonObj)) {
        throw(new Error('JSON object is not valid.'));
      }
      if (jsonObj == '{}') {
        jsonObj = null;
      }

    } catch (e) {
      //parameter was invalid
      console.log('error occured running query -' + e.message);
      return false;
    }

    try {
      curl = baasio.Curl.buildCurlCall(Query, endpoint);
      //log the curl call
      console.log(curl);
      //store the curl command back in the object
      Query.setCurl(curl);
    } catch(e) {
      //curl module not enabled
    }

    //so far so good, so run the query
    var xD = window.XDomainRequest ? true : false;
    var xhr = getXHR(method, path, jsonObj);

    // Handle response.
    xhr.onerror = function() {
      //for timing, call end
      Query.setQueryEndTime();
      //for timing, log the total call time
      console.log(Query.getQueryTotalTime());
      //network error
      clearTimeout(timeout);
      console.log('API call failed at the network level.');
      //send back an error (best we can do with what ie gives back)
      Query.callFailureCallback(response.innerText);
    };
    xhr.xdomainOnload = function (response) {
      //for timing, call end
      Query.setQueryEndTime();
      //for timing, log the total call time
      console.log('Call timing: ' + Query.getQueryTotalTime());
      //call completed
      clearTimeout(timeout);
      //decode the response
      response = JSON.parse(xhr.responseText);
      //if a cursor was present, grab it
      try {
        var cursor = response.cursor || null;
        Query.saveCursor(cursor);
      }catch(e) {}
      Query.callSuccessCallback(response);
    };
    xhr.onload = function(response) {
      //for timing, call end
      Query.setQueryEndTime();
      //for timing, log the total call time
      console.log('Call timing: ' + Query.getQueryTotalTime());
      //call completed
      clearTimeout(timeout);
      //decode the response
      response = JSON.parse(xhr.responseText);
      if (xhr.status != 200 && !xD)   {
        //there was an api error
        try {
          var error = response.error;
          console.log('API call failed: (status: '+xhr.status+').' + error.type);
          if ( (error.type == "auth_expired_session_token") ||
               (error.type == "unauthorized")   ||
               (error.type == "auth_missing_credentials")   ||
               (error.type == "auth_invalid")) {
            //this error type means the user is not authorized. If a logout function is defined, call it
            callLogoutCallback();
        }} catch(e){}
        //otherwise, just call the failure callback
        Query.callFailureCallback(response.error_description);
        return;
      } else {
        //query completed succesfully, so store cursor
        var cursor = response.cursor || null;
        Query.saveCursor(cursor);
        //then call the original callback
        Query.callSuccessCallback(response);
     }
    };

    var timeout = setTimeout(
      function() {
        xhr.abort();
        if (baasio.ApiClient.getCallTimeoutCallback() === 'function') {
          baasio.ApiClient.callTimeoutCallback('API CALL TIMEOUT');
        } else {
          Query.callFailureCallback('API CALL TIMEOUT');
        }
      },
      baasio.ApiClient.getCallTimeout()); //set for 30 seconds

    xhr.send(jsonObj);
  }

   /**
   *  A private method to return the XHR object
   *
   *  @method getXHR
   *  @private
   *  @params {string} method (GET,POST,PUT,DELETE)
   *  @params {string} path - api endpoint to call
   *  @return {object} jsonObj - the json object if there is one
   */
  function getXHR(method, path, jsonObj) {
    var xhr;
    if(window.XDomainRequest)
    {
      xhr = new window.XDomainRequest();
      if (baasio.ApiClient.getToken()) {
        if (path.indexOf("?")) {
          path += '&access_token='+Usergrid.ApiClient.getToken();
        } else {
          path = '?access_token='+Usergrid.ApiClient.getToken();
        }
      }
      xhr.open(method, path, true);
    }
    else
    {
      xhr = new XMLHttpRequest();
      xhr.open(method, path, true);
      //add content type = json if there is a json payload
      if (jsonObj) {
        xhr.setRequestHeader("Content-Type", "application/json");
      }
      if (baasio.ApiClient.getToken()) {
        xhr.setRequestHeader("Authorization", "Bearer " + baasio.ApiClient.getToken());
        xhr.withCredentials = true;
      }
    }
    return xhr;
  }

  return {
    init:init,
    runAppQuery:runAppQuery,
    runManagementQuery:runManagementQuery,
    getOrganizationName:getOrganizationName,
    setOrganizationName:setOrganizationName,
    getApplicationName:getApplicationName,
    setApplicationName:setApplicationName,
    getToken:getToken,
    setToken:setToken,
    getQueryType:getQueryType,
    getCallTimeout:getCallTimeout,
    setCallTimeout:setCallTimeout,
    getCallTimeoutCallback:getCallTimeoutCallback,
    setCallTimeoutCallback:setCallTimeoutCallback,
    callTimeoutCallback:callTimeoutCallback,
    getApiUrl:getApiUrl,
    setApiUrl:setApiUrl,
    getResetPasswordUrl:getResetPasswordUrl,
    getLoggedInUser:getLoggedInUser,
    setLoggedInUser:setLoggedInUser,
    logInAppUser:logInAppUser,
    logInWithFacebook:logInWithFacebook,
    renewAppUserToken:renewAppUserToken,
    logoutAppUser:logoutAppUser,
    encodeParams:encodeParams,
    isLoggedInAppUser:isLoggedInAppUser,
    getLogoutCallback:getLogoutCallback,
    setLogoutCallback:setLogoutCallback,
    callLogoutCallback:callLogoutCallback
  }
})();