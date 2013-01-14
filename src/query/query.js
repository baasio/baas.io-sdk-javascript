/**
 *  A class to Model a Usergrid Entity.
 *
 *  @class Entity
 *  @author Rod Simpson (rod@apigee.com)
 */
(function (baasio) {
  baasio = baasio || {};

  baasio.Query = function(method, resource, jsonObj, paramsObj, successCallback, failureCallback) {
    //query vars
    this._method = method;
    this._resource = resource;
    this._jsonObj = jsonObj;
    this._paramsObj = paramsObj;
    this._successCallback = successCallback;
    this._failureCallback = failureCallback;

    //curl command - will be populated by runQuery function
    this._curl = '';
    this._token = false;

    //paging vars
    this._cursor = null;
    this._next = null;
    this._previous = [];
    this._start = 0;
    this._end = 0;
  };

  _.extend(baasio.Query.prototype, {

  	setQueryStartTime: function() {
       this._start = new Date().getTime();
     },

     setQueryEndTime: function() {
       this._end = new Date().getTime();
     },

     getQueryTotalTime: function() {
       var seconds = 0;
       var time = this._end - this._start;
       try {
          seconds = ((time/10) / 60).toFixed(2);
       } catch(e){ return 0; }
       return this.getMethod() + " " + this.getResource() + " - " + seconds + " seconds";
     },

    /**
     *  A method to set all settable parameters of the Query at one time
     *
     *  @public
     *  @method validateUsername
     *  @param {string} method
     *  @param {string} path
     *  @param {object} jsonObj
     *  @param {object} paramsObj
     *  @param {function} successCallback
     *  @param {function} failureCallback
     *  @return none
     */
    setAllQueryParams: function(method, resource, jsonObj, paramsObj, successCallback, failureCallback) {
      this._method = method;
      this._resource = resource;
      this._jsonObj = jsonObj;
      this._paramsObj = paramsObj;
      this._successCallback = successCallback;
      this._failureCallback = failureCallback;
    },

    /**
     *  A method to reset all the parameters in one call
     *
     *  @public
     *  @return none
     */
    clearAll: function() {
      this._method = null;
      this._resource = null;
      this._jsonObj = {};
      this._paramsObj = {};
      this._successCallback = null;
      this._failureCallback = null;
    },

    /**
    * Returns the method
    *
    * @public
    * @method getMethod
    * @return {string} Returns method
    */
    getMethod: function() {
      return this._method;
    },

    /**
    * sets the method (POST, PUT, DELETE, GET)
    *
    * @public
    * @method setMethod
    * @return none
    */
    setMethod: function(method) {
      this._method = method;
    },

    /**
    * Returns the resource
    *
    * @public
    * @method getResource
    * @return {string} the resource
    */
    getResource: function() {
      return this._resource;
    },

    /**
    * sets the resource
    *
    * @public
    * @method setResource
    * @return none
    */
    setResource: function(resource) {
      this._resource = resource;
    },

    /**
    * Returns the json Object
    *
    * @public
    * @method getJsonObj
    * @return {object} Returns the json Object
    */
    getJsonObj: function() {
      return this._jsonObj;
    },

    /**
    * sets the json object
    *
    * @public
    * @method setJsonObj
    * @return none
    */
    setJsonObj: function(jsonObj) {
      this._jsonObj = jsonObj;
    },
    
    /**
    * Returns the Query Parameters object
    *
    * @public
    * @method getQueryParams
    * @return {object} Returns Query Parameters object
    */
    getQueryParams: function() {
      return this._paramsObj;
    },

    /**
    * sets the query parameter object
    *
    * @public
    * @method setQueryParams
    * @return none
    */
    setQueryParams: function(paramsObj) {
      this._paramsObj = paramsObj;
    },

    /**
    * Returns the success callback function
    *
    * @public
    * @method getSuccessCallback
    * @return {function} Returns the successCallback
    */
    getSuccessCallback: function() {
      return this._successCallback;
    },

    /**
    * sets the success callback function
    *
    * @public
    * @method setSuccessCallback
    * @return none
    */
    setSuccessCallback: function(successCallback) {
      this._successCallback = successCallback;
    },

    /**
    * Calls the success callback function
    *
    * @public
    * @method callSuccessCallback
    * @return {boolean} Returns true or false based on if there was a callback to call
    */
    callSuccessCallback: function(response) {
      if (this._successCallback && typeof(this._successCallback ) === "function") {
        this._successCallback(response);
        return true;
      } else {
        return false;
      }
    },

    /**
    * Returns the failure callback function
    *
    * @public
    * @method getFailureCallback
    * @return {function} Returns the failureCallback
    */
    getFailureCallback: function() {
      return this._failureCallback;
    },

    /**
    * sets the failure callback function
    *
    * @public
    * @method setFailureCallback
    * @return none
    */
    setFailureCallback: function(failureCallback) {
      this._failureCallback = failureCallback;
    },

    /**
    * Calls the failure callback function
    *
    * @public
    * @method callFailureCallback
    * @return {boolean} Returns true or false based on if there was a callback to call
    */
    callFailureCallback: function(response) {
      if (this._failureCallback && typeof(this._failureCallback) === "function") {
        this._failureCallback(response);
        return true;
      } else {
        return false;
      }
    },

    /**
    * Returns the curl call
    *
    * @public
    * @method getCurl
    * @return {function} Returns the curl call
    */
    getCurl: function() {
      return this._curl;
    },

    /**
    * sets the curl call
    *
    * @public
    * @method setCurl
    * @return none
    */
    setCurl: function(curl) {
      this._curl = curl;
    },

    /**
    * Returns the Token
    *
    * @public
    * @method getToken
    * @return {function} Returns the Token
    */
    getToken: function() {
      return this._token;
    },

    /**
    * Method to set
    *
    * @public
    * @method setToken
    * @return none
    */
    setToken: function(token) {
      this._token = token;
    },

    /**
    * Resets the paging pointer (back to original page)
    *
    * @public
    * @method resetPaging
    * @return none
    */
    resetPaging: function() {
      this._previous = [];
      this._next = null;
      this._cursor = null;
    },

    /**
    * Method to determine if there is a previous page of data
    *
    * @public
    * @method hasPrevious
    * @return {boolean} true or false based on if there is a previous page
    */
    hasPrevious: function() {
      return (this._previous.length > 0);
    },

    /**
    * Method to set the paging object to get the previous page of data
    *
    * @public
    * @method getPrevious
    * @return none
    */
    getPrevious: function() {
      this._next=null; //clear out next so the comparison will find the next item
      this._cursor = this._previous.pop();
    },

    /**
    * Method to determine if there is a next page of data
    *
    * @public
    * @method hasNext
    * @return {boolean} true or false based on if there is a next page
    */
    hasNext: function(){
      return (this._next);
    },

    /**
    * Method to set the paging object to get the next page of data
    *
    * @public
    * @method getNext
    * @return none
    */
    getNext: function() {
      this._previous.push(this._cursor);
      this._cursor = this._next;
    },

    /**
    * Method to save off the cursor just returned by the last API call
    *
    * @public
    * @method saveCursor
    * @return none
    */
    saveCursor: function(cursor) {
      //if current cursor is different, grab it for next cursor
      if (this._next !== cursor) {
        this._next = cursor;
      }
    },

    /**
    * Method to determine if there is a next page of data
    *
    * @public
    * @method getCursor
    * @return {string} the current cursor
    */
    getCursor: function() {
      return this._cursor;
    },

    isUUID: function(uuid) {
      var uuidValueRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (!uuid) return false;
      return uuidValueRegex.test(uuid);
    }
  });


})(baasio);