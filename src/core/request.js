//https://github.com/apigee/usergrid-javascript-sdk/blob/master/usergrid.SDK.js

function run (Query, endpoint) {
    //validate parameters
    try {
      //verify that the query object is valid
      if(!(Query instanceof Usergrid.Query)) {
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
      var application_name = Usergrid.ApiClient.getApplicationName();
      if (application_name) {
        application_name = application_name.toUpperCase();
      }
      //if (application_name != 'SANDBOX' && Usergrid.ApiClient.getToken()) {
      if ( (application_name != 'SANDBOX' && Usergrid.ApiClient.getToken()) || (getQueryType() == Usergrid.M && Usergrid.ApiClient.getToken())) {
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
      path = Usergrid.ApiClient.getApiUrl() + path;

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
      curl = Usergrid.Curl.buildCurlCall(Query, endpoint);
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
        if (Usergrid.ApiClient.getCallTimeoutCallback() === 'function') {
          Usergrid.ApiClient.callTimeoutCallback('API CALL TIMEOUT');
        } else {
          Query.callFailureCallback('API CALL TIMEOUT');
        }        
      }, 
      Usergrid.ApiClient.getCallTimeout()); //set for 30 seconds

    xhr.send(jsonObj);
  }