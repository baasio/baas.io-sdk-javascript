Baas.IO = function(options) {
  //Baas enpoint
  this.URI = 'https://api.baas.io';

  //Find your Baas.io ID and Application ID in the portal Dashboard (http://baas.io/app/)
  this.orgName = options.orgName;
  this.appName = options.appName;
  
  //other options
  this.buildCurl = options.buildCurl || false;
  this.logging = options.logging || false;

  //timeout and callbacks
  this._callTimeout =  options.callTimeout || 30000; //default to 30 seconds
  this._callTimeoutCallback =  options.callTimeoutCallback || null;
  this.logoutCallback =  options.logoutCallback || null;

};



/*
*  Main function for making requests to the API.  Can be called directly.
*
*  options object:
*  `method` - http method (GET, POST, PUT, or DELETE), defaults to GET
*  `qs` - object containing querystring values to be appended to the uri
*  `body` - object containing entity body for POST and PUT requests
*  `endpoint` - API endpoint, for example 'users/fred'
*  `mQuery` - boolean, set to true if running management query, defaults to false
*
*  @method request
*  @public
*  @params {object} options
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.IO.prototype.request = function (options, callback) {
  var self = this;
  var method = options.method || 'GET';
  var endpoint = options.endpoint;
  var body = options.body || {};
  var qs = options.qs || {};
  var mQuery = options.mQuery || false; //is this a query to the management endpoint?
  if (mQuery) {
    var uri = this.URI + '/' + endpoint;
  } else {
    var uri = this.URI + '/' + this.orgName + '/' + this.appName + '/' + endpoint;
  }

  if (self.getToken()) {
    qs['access_token'] = self.getToken();
    //could also use headers for the token
    //xhr.setRequestHeader("Authorization", "Bearer " + self.getToken());
    //xhr.withCredentials = true;
  }

  //append params to the path
  var encoded_params = encodeParams(qs);
  if (encoded_params) {
    uri += "?" + encoded_params;
  }

  //stringify the body object
  body = JSON.stringify(body);

  //so far so good, so run the query
  var xhr = new XMLHttpRequest();
  xhr.open(method, uri, true);
  //add content type = json if there is a json payload
  if (body) {
    xhr.setRequestHeader("Content-Type", "application/json");
  }

  // Handle response.
  xhr.onerror = function() {
    self._end = new Date().getTime();
    if (self.logging) {
      console.log('success (time: ' + self.calcTimeDiff() + '): ' + method + ' ' + uri);
    }
    if (self.logging) {
      console.log('Error: API call failed at the network level.')
    }
    //network error
    clearTimeout(timeout);
    var err = true;
    if (typeof(callback) === 'function') {
      callback(err, data);
    }
  };

  xhr.onload = function(response) {
    //call timing, get time, then log the call
    self._end = new Date().getTime();
    if (self.logging) {
      console.log('success (time: ' + self.calcTimeDiff() + '): ' + method + ' ' + uri);
    }
    //call completed
    clearTimeout(timeout);
    //decode the response
    response = JSON.parse(xhr.responseText);
    if (xhr.status != 200)   {
      //there was an api error
      var error = response.error;
      var error_description = response.error_description;
      if (self.logging) {
        console.log('Error ('+ xhr.status +')(' + error + '): ' + error_description )
      }
      if ( (error == "auth_expired_session_token") ||
           (error == "unauthorized")   ||
           (error == "auth_missing_credentials")   ||
           (error == "auth_invalid")) {
        //this error type means the user is not authorized. If a logout function is defined, call it
        //if the user has specified a logout callback:
        if (typeof(self.logoutCallback) === 'function') {
          return self.logoutCallback(true, response);
        }
      }
      if (typeof(callback) === 'function') {
        callback(true, response);
      }
    } else {
      if (typeof(callback) === 'function') {
        callback(false, response);
      }
    }
  };

  var timeout = setTimeout(
    function() {
      xhr.abort();
      if (self._callTimeoutCallback === 'function') {
        self._callTimeoutCallback('API CALL TIMEOUT');
      } else {
        self.callback('API CALL TIMEOUT');
      }
    },
    self._callTimeout); //set for 30 seconds

  if (this.logging) {
    console.log('calling: ' + method + ' ' + uri);
  }
  if (this.buildCurl) {
    var curlOptions = {
      uri:uri,
      body:body,
      method:method
    }
    this.buildCurlCall(curlOptions);
  }
  this._start = new Date().getTime();
  xhr.send(body);
}

/*
*  Main function for creating new entities - should be called directly.
*
*  options object: options {data:{'type':'collection_type', 'key':'value'}, uuid:uuid}}
*
*  @method createEntity
*  @public
*  @params {object} options
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.IO.prototype.createEntity = function (options, callback) {
  var options = {
    client:this,
    data:options
  }
  var entity = new Baas.Entity(options);
  entity.save(function(err, data) {
    if (typeof(callback) === 'function') {
      callback(err, entity);
    }
  });
}

/*
*  Main function for creating new collections - should be called directly.
*
*  options object: options {client:client, type: type, qs:qs}
*
*  @method createCollection
*  @public
*  @params {object} options
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.IO.prototype.createCollection = function (options, callback) {
  options.client = this;
  var collection = new Baas.Collection(options, function(err, data) {
    if (typeof(callback) === 'function') {
      callback(err, collection);
    }
  });
}

/*
*  Function for creating new activities for the current user - should be called directly.
* 
*  //user can be any of the following: "me", a uuid, a username
*  Note: the "me" alias will reference the currently logged in user (e.g. 'users/me/activties')
* 
*  //build a json object that looks like this:
*  var options =
*  {
*    "actor" : {
*      "displayName" :"myusername",
*      "uuid" : "myuserid",
*      "username" : "myusername",
*      "email" : "myemail",
*      "picture": "http://path/to/picture",
*      "image" : {
*          "duration" : 0,
*          "height" : 80,
*          "url" : "http://www.gravatar.com/avatar/",
*          "width" : 80
*      },
*    },
*    "verb" : "post",
*    "content" : "My cool message",
*    "lat" : 48.856614,
*    "lon" : 2.352222
*  }

*
*  @method createEntity
*  @public
*  @params {string} user // "me", a uuid, or a username
*  @params {object} options
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.IO.prototype.createUserActivity = function (user, options, callback) {
  options.type = 'users/'+user+'/activities';
  var options = {
    client:this,
    data:options
  }
  var entity = new Baas.Entity(options);
  entity.save(function(err, data) {
    if (typeof(callback) === 'function') {
      callback(err, entity);
    }
  });
}

/*
*  A private method to get call timing of last call
*/
Baas.IO.prototype.calcTimeDiff = function () {
 var seconds = 0;
 var time = this._end - this._start;
 try {
    seconds = ((time/10) / 60).toFixed(2);
 } catch(e) { return 0; }
 return seconds;
}

/*
*  A public method to store the OAuth token for later use - uses localstorage if available
*
*  @method setToken
*  @public
*  @params {string} token
*  @return none
*/
Baas.IO.prototype.setToken = function (token) {
  this.token = token;
  if(typeof(Storage)!=="undefined"){
    localStorage.setItem('token', token);
  }
}

/*
*  A public method to get the OAuth token
*
*  @method getToken
*  @public
*  @return {string} token
*/
Baas.IO.prototype.getToken = function () {
  if (this.token) {
    return this.token;
  } else if(typeof(Storage)!=="undefined") {
    return localStorage.getItem('token');
  }
  return null;
}

/*
*  A public method to log in an app user - stores the token for later use
*
*  @method login
*  @public
*  @params {string} username
*  @params {string} password
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.IO.prototype.login = function (username, password, callback) {
  var self = this;
  var options = {
    method:'GET',
    endpoint:'token',
    qs:{
      username: username,
      password: password,
      grant_type: 'password'
    }
  };
  this.request(options, function(err, data) {
    var user = {};
    if (err && self.logging) {
      console.log('error trying to log user in');
    } else {
      user = new Baas.Entity('users', data.user);
      self.setToken (data.access_token);
    }
    if (typeof(callback) === 'function') {
      callback(err, data, user);
    }
  });
}

/*
*  A public method to log in an app user with facebook - stores the token for later use
*
*  @method loginFacebook
*  @public
*  @params {string} username
*  @params {string} password
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.IO.prototype.loginFacebook = function (facebookToken, callback) {
  var self = this;
  var options = {
    method:'GET',
    endpoint:'auth/facebook',
    qs:{
      fb_access_token: facebookToken
    }
  };
  this.request(options, function(err, data) {
    var user = {};
    if (err && self.logging) {
      console.log('error trying to log user in');
    } else {
      user = new Baas.Entity('users', data.user);
      self.setToken(data.access_token);
    }
    if (typeof(callback) === 'function') {
      callback(err, data, user);
    }
  });
}

/*
*  A public method to get the currently logged in user entity
*
*  @method getLoggedInUser
*  @public
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.IO.prototype.getLoggedInUser = function (callback) {
  if (!this.getToken()) {
    callback(true, null, null);
  } else {
    var self = this;
    var options = {
      method:'GET',
      endpoint:'users/me',
    };
    this.request(options, function(err, data) {
      if (err) {
        if (self.logging) {
          console.log('error trying to log user in');
        }
        if (typeof(callback) === 'function') {
          callback(err, data, null);
        }
      } else {
        var options = {
          client:self,
          data:data.entities[0]
        }
        var user = new Baas.Entity(options);
        if (typeof(callback) === 'function') {
          callback(err, data, user);
        }
      }
    });
  }
}

/*
*  A public method to test if a user is logged in - does not guarantee that the token is still valid,
*  but rather that one exists
*
*  @method isLoggedIn
*  @public
*  @return {boolean} Returns true the user is logged in (has token and uuid), false if not
*/
Baas.IO.prototype.isLoggedIn = function () {
  if (this.getToken()) {
    return true;
  }
  return false;
}

/*
*  A public method to log out an app user - clears all user fields from client
*
*  @method logout
*  @public
*  @return none
*/
Baas.IO.prototype.logout = function () {
  this.setToken(null);
}

/*
*  A private method to build the curl call to display on the command line
*
*  @method buildCurlCall
*  @private
*  @param {object} options
*  @return {string} curl
*/
Baas.IO.prototype.buildCurlCall = function (options) {
  var curl = 'curl';
  var method = (options.method || 'GET').toUpperCase();
  var body = options.body || {};
  var uri = options.uri;

  //curl - add the method to the command (no need to add anything for GET)
  if (method === 'POST') {curl += ' -X POST'; }
  else if (method === 'PUT') { curl += ' -X PUT'; }
  else if (method === 'DELETE') { curl += ' -X DELETE'; }
  else { curl += ' -X GET'; }

  //curl - append the path
  curl += ' ' + uri;

  //curl - add the body
  body = JSON.stringify(body)
  if (body !== '"{}"' && method !== 'GET' && method !== 'DELETE') {
    //curl - add in the json obj
    curl += " -d '" + body + "'";
  }

  //log the curl command to the console
  console.log(curl);

  return curl;
}


/*
* Tests if the string is a uuid
*
* @public
* @method isUUID
* @param {string} uuid The string to test
* @returns {Boolean} true if string is uuid
*/
function isUUID (uuid) {
  var uuidValueRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuid) return false;
  return uuidValueRegex.test(uuid);
}


/*
*  method to encode the query string parameters
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