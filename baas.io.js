(function() {
	
	var root = this;
	var Baas = root.Baas || {};

	root.console = root.console || {};
	root.console.log = root.console.log || function() {};

	// Current version.
	Baas.VERSION = '0.9.2';

	// AMD 모듈 방식 - require() -과 Node.js 모듈 시스템을 위한 코드 
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Baas;
		}

		exports.Baas = Baas;
	} else {
		root.Baas = Baas;
	}

	/*
	*  The class models Baas io.
	*
	*  @constructor
	*  @param {string} options - configuration object
	*/

	Baas.IO = function(options) {
		//usergrid enpoint
		this.URI = options.URI || 'https://api.baas.io';

		//Find your Orgname and Appname in the Admin portal (http://apigee.com/usergrid)
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
		var contentType = options.contentType || 'application/json';
		var qs = options.qs || {};
		var mQuery = options.mQuery || false; //is this a query to the management endpoint?
		if (mQuery) {
			var uri = this.URI + '/' + endpoint;
		} else {
			var uri = this.URI + '/' + this.orgName + '/' + this.appName + '/' + endpoint;
		}

		//if (self.getToken()) {
			//qs['access_token'] = self.getToken();
			/* //could also use headers for the token
			xhr.setRequestHeader("Authorization", "Bearer " + self.getToken());
			xhr.withCredentials = true;
			*/
		//}

		//append params to the path
		var encoded_params = Baas.Utils.encodeParams(qs);
		if (encoded_params) {
			uri += "?" + encoded_params;
		}

		//stringify the body object
		//body = (body instanceof FormData) ? body : body;
		//20140807 modify
		body = (contentType === 'application/json') ? JSON.stringify(body) : body;

		//so far so good, so run the query
		var xhr = new XMLHttpRequest();
		xhr.open(method, uri, true);

		if (self.getToken()) {
			xhr.setRequestHeader("Authorization", "Bearer " + self.getToken());
		}

		if(contentType){
			xhr.setRequestHeader("Content-Type", contentType);
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

			//download file
			if(endpoint.indexOf('files/') >= 0 && endpoint.indexOf('/data') >= 0) {callback(false);return;}

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
						(error == "auth_missing_credentials")   ||
						(error == "auth_unverified_oath")       ||
						(error == "expired_token")              ||
						(error == "unauthorized")               ||
						(error == "auth_invalid")) {
					//these errors mean the user is not authorized for whatever reason. If a logout function is defined, call it
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
	 *  function for building asset urls
	 *
	 *  @method buildAssetURL
	 *  @public
	 *  @params {string} uuid
	 *  @return {string} assetURL
	 */
	 /**
		* baas.io is not being supported 'buildAssetURL' function.
		*/
	 /*
	 Baas.IO.prototype.buildAssetURL = function(uuid) {
		 var self = this;
		 var qs = {};
		 var assetURL = this.URI + '/' + this.orgName + '/' + this.appName + '/assets/' + uuid + '/data';
	 
		 if (self.getToken()) {
			 qs['access_token'] = self.getToken();
		 }
	 
		 //append params to the path
		 var encoded_params = encodeParams(qs);
		 if (encoded_params) {
			 assetURL += "?" + encoded_params;
		 }

		 return assetURL;
	 }
	 */

	/*
	 *  Main function for creating new groups. Call this directly.
	 *
	 *  @method createGroup
	 *  @public
	 *  @params {string} path
	 *  @param {function} callback
	 *  @return {callback} callback(err, data)
	 */
	Baas.IO.prototype.createGroup = function(options, callback) {
		var getOnExist = options.getOnExist || false;

		var options = {
			path: options.path,
			client: this,
			data:options
		}

		var group = new Baas.Group(options);
		group.fetch(function(err, data){
			var okToSave = (err && 'Service resource not found' === data.error_description || 'no_name_specified' === data.error || 'null_pointer' === data.error_description) || (!err && getOnExist);
			if (okToSave) {
				group.save(function(err){
					if (typeof(callback) === 'function') {
						callback(err, group);
					}
				});
			} else {
				if(typeof(callback) === 'function') {
					callback(err, group);
				}
			}
		});
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
		// todo: replace the check for new / save on not found code with simple save
		// when users PUT on no user fix is in place.
		/*
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
		*/
		var getOnExist = options.getOnExist || false; //if true, will return entity if one already exists
		var options = {
			client:this,
			data:options
		}
		var entity = new Baas.Entity(options);
		entity.fetch(function(err, data) {
			//if the fetch doesn't find what we are looking for, or there is no error, do a save
			var okToSave = (err && 'Service resource not found' === data.error_description || 'no_name_specified' === data.error || 'null_pointer' === data.error_description) || (!err && getOnExist);
			if(okToSave) {
				entity.set(options.data); //add the data again just in case
				entity.save(function(err) {
					if (typeof(callback) === 'function') {
						callback(err, entity);
					}
				});
			} else {
				if (typeof(callback) === 'function') {
					callback(err, entity);
				}
			}
		});

	}

	/*
	 *  Main function for restoring an entity from serialized data.
	 *
	 *  serializedObject should have come from entityObject.serialize();
	 *
	 *  @method restoreEntity
	 *  @public
	 *  @param {string} serializedObject
	 *  @return {object} Entity Object
	 */
	Baas.IO.prototype.restoreEntity = function (serializedObject) {
		var data = JSON.parse(serializedObject);
		var options = {
			client:this,
			data:data
		}
		var entity = new Baas.Entity(options);
		return entity;
	}

	/*
	*  Main function for getting existing entities - should be called directly.
	*
	*  You must supply a uuid or (username or name). Username only applies to users.
	*  Name applies to all custom entities
	*
	*  options object: options {data:{'type':'collection_type', 'name':'value', 'username':'value'}, uuid:uuid}}
	*
	*  @method createEntity
	*  @public
	*  @params {object} options
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*/
	Baas.IO.prototype.getEntity = function (options, callback) {
		var options = {
			client:this,
			data:options
		}
		var entity = new Baas.Entity(options);
		entity.fetch(function(err) {
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
		var collection = new Baas.Collection(options, function(err) {
			if (typeof(callback) === 'function') {
				callback(err, collection);
			}
		});
	}

	/*
	 *  Main function for restoring a collection from serialized data.
	 *
	 *  serializedObject should have come from collectionObject.serialize();
	 *
	 *  @method restoreCollection
	 *  @public
	 *  @param {string} serializedObject
	 *  @return {object} Collection Object
	 */
	Baas.IO.prototype.restoreCollection = function (serializedObject) {
		var data = JSON.parse(serializedObject);
		data.client = this;
		var collection = new Baas.Collection(data);
		return collection;
	}

	/*
	 *  Main function for retrieving a user's activity feed.
	 *
	 *  @method getFeedForUser
	 *  @public
	 *  @params {string} username or uuid or email
	 *  @param {function} callback
	 *  @return {callback} callback(err, data, activities)
	 */
	Baas.IO.prototype.getFeedForUser = function(username, callback) {
		var options = {
			method: "GET",
			endpoint: "users/"+username+"/feed"
		}

		this.request(options, function(err, data){
			if(typeof(callback) === "function") {
				if(err) {
					callback(err);
				} else {
					callback(err, data, data.entities);
				}
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
		entity.save(function(err) {
			if (typeof(callback) === 'function') {
				callback(err, entity);
			}
		});
	}

	/*
	 *  Function for creating user activities with an associated user entity.
	 *
	 *  user object:
	 *  The user object passed into this function is an instance of Baas.Entity.
	 *
	 *  @method createUserActivityWithEntity
	 *  @public
	 *  @params {object} user
	 *  @params {string} content
	 *  @param {function} callback
	 *  @return {callback} callback(err, data)
	 */
	Baas.IO.prototype.createUserActivityWithEntity = function(user, content, callback) {
		var username = user.get("username");
		var options = {
			actor: {
				"displayName":username,
				"uuid":user.get("uuid"),
				"username":username,
				"email":user.get("email"),
				"picture":user.get("picture"),
				"image": {
					"duration":0,
					"height":80,
					"url":user.get("picture"),
					"width":80
				 },
			},
			"verb":"post",
			"content":content };

			this.createUserActivity(username, options, callback);
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
		var tokenKey = 'token' + this.appName + this.orgName;
		this.token = token;
		if(typeof(Storage)!=="undefined"){
			if (token) {
				localStorage.setItem(tokenKey, token);
			} else {
				localStorage.removeItem(tokenKey);
			}
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
		var tokenKey = 'token' + this.appName + this.orgName;
		if (this.token) {
			return this.token;
		} else if(typeof(Storage)!=="undefined") {
			return localStorage.getItem(tokenKey);
		}
		return null;
	}

	/*
	 * A public facing helper method for signing up users
	 *
	 * @method signup
	 * @public
	 * @params {string} username
	 * @params {string} password
	 * @params {string} email
	 * @param {function} callback
	 * @return {callback} callback(err, data)
	 */
	Baas.IO.prototype.signup = function(username, password, email, callback) {
		var options = {
			type:"users",
			username:username,
			password:password,
			email:email,
		};

		this.createEntity(options, callback);
	}


	/*
	 * Kakao의 API를 사용하여 Baas.io User Collection에 User를 추가하는 메소드
	 *
	 * @method kakao_signup
	 * @public
	 * @params {object} kakao_data
	 * @param {function} callback
	 */
	Baas.IO.prototype.kakao_signup = function(kakao_data, callback){

		var options = {
			method:'POST',
			endpoint : 'auth/kakaotalk',
			contentType : 'application/x-www-form-urlencoded',
			token : this.getToken(),
			body:'kkt_access_token=' + kakao_data.kkt_access_token
		}

		this.request(options, callback);

	}

	/*
	 * Kakao의 token으로 signin을 할 수 있는 메소드
	 *
	 * @method kakao_signup
	 * @public
	 * @params {object} kakao_data
	 * @param {function} callback
	 */
	Baas.IO.prototype.kakao_signin = function(kakao_data, callback){
		this.kakao_signup.apply(this,arguments);
	}


	/*
	 * Kakao의 token으로 login을 할 수 있는 메소드
	 *
	 * @method kakao_signup
	 * @public
	 * @params {object} kakao_data
	 * @param {function} callback
	 */
	Baas.IO.prototype.kakao_login = function(kakao_data, callback){
		this.kakao_signup.apply(this,arguments);
	}

	/*
	*
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
			method:'POST',
			endpoint:'token',
			body:{
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
				var options = {
					client:self,
					data:data.user
				}
				user = new Baas.Entity(options);
				self.setToken(data.access_token);
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
				var options = {
					client: self,
					data: data.user
				}
				user = new Baas.Entity(options);
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
		if (this.getToken() && this.getToken() != 'null') {
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
		if (body !== '"{}"' && method !== 'GET' && method !== 'DELETE') {
			//curl - add in the json obj
			curl += " -d '" + body + "'";
		}

		//log the curl command to the console
		console.log(curl);

		return curl;
	}


  /*
  *  A class to Model a Baas Entity.
  *  Set the type of entity in the 'data' json object
  *
  *  @constructor
  *  @param {object} options {client:client, data:{'type':'collection_type', 'key':'value'}, uuid:uuid}}
  */
  Baas.Entity = function(options) {
	if(options){
	  this._client = options.client;
	  this._data = options.data || {};
	}
  };

  /*
   *  returns a serialized version of the entity object
   *
   *  Note: use the client.restoreEntity() function to restore
   *
   *  @method serialize
   *  @return {string} data
   */
  Baas.Entity.prototype.serialize = function () {
	return JSON.stringify(this._data);
  }

  /*
  *  gets a specific field or the entire data object. If null or no argument
  *  passed, will return all data, else, will return a specific field
  *
  *  @method get
  *  @param {string} field
  *  @return {string} || {object} data
  */
  Baas.Entity.prototype.get = function (field) {
	if (field) {
	  return this._data[field];
	} else {
	  return this._data;
	}
  }

  /*
  *  adds a specific key value pair or object to the Entity's data
  *  is additive - will not overwrite existing values unless they
  *  are explicitly specified
  *
  *  @method set
  *  @param {string} key || {object}
  *  @param {string} value
  *  @return none
  */
  Baas.Entity.prototype.set = function (key, value) {
	if (typeof key === 'object') {
	  for(var field in key) {
		this._data[field] = key[field];
	  }
	} else if (typeof key === 'string') {
	  if (value === null) {
		delete this._data[key];
	  } else {
		this._data[key] = value;
	  }
	} else {
	  this._data = null;
	}
  }

  /*
  *  Saves the entity back to the database
  *
  *  @method save
  *  @public
  *  @param {function} callback
  *  @return {callback} callback(err, data)
  */
  Baas.Entity.prototype.save = function (callback) {
	//TODO:  API will be changed soon to accomodate PUTs via name which create new entities
	//       This function should be changed to PUT only at that time, and updated to use
	//       either uuid or name
	var type = this.get('type');
	var method = 'POST';
	if (Baas.Utils.isUUID(this.get('uuid'))) {
	  method = 'PUT';
	  type += '/' + this.get('uuid');
	} else if(type === 'users' && this.get('username')) {
	  method = 'PUT';
	  type += '/' + this.get('username');
	} else if(this.get('name')){
	   method = 'PUT';
	  type += '/' + this.get('name');
	}

	//update the entity
	var self = this;
	var data = {};
	var entityData = this.get();
	//remove system specific properties
	for (var item in entityData) {
	  if (item === 'metadata' || item === 'created' || item === 'modified' ||
		  item === 'type' || item === 'activated' || item ==='uuid') { continue; }
	  data[item] = entityData[item];
	}
	var options =  {
	  method:method,
	  endpoint:type,
	  body:data
	};
	//save the entity first
	this._client.request(options, function (err, retdata) {
	  if (err && self._client.logging) {
		console.log('could not save entity');
		if (typeof(callback) === 'function') {
		  return callback(err, retdata, self);
		}
	  } else {
		if (retdata.entities) {
		  if (retdata.entities.length) {
			var entity = retdata.entities[0];
			self.set(entity);
		  }
		}
		//if this is a user, update the password if it has been specified;
		var needPasswordChange = (self.get('type') === 'user' && entityData.oldpassword && entityData.newpassword);
		if (needPasswordChange) {
		  //Note: we have a ticket in to change PUT calls to /users to accept the password change
		  //      once that is done, we will remove this call and merge it all into one
		  var pwdata = {};
		  pwdata.oldpassword = entityData.oldpassword;
		  pwdata.newpassword = entityData.newpassword;
		  var options = {
			method:'PUT',
			endpoint:type+'/password',
			body:pwdata
		  }
		  self._client.request(options, function (err, data) {
			if (err && self._client.logging) {
			  console.log('could not update user');
			}
			//remove old and new password fields so they don't end up as part of the entity object
			self.set('oldpassword', null);
			self.set('newpassword', null);
			if (typeof(callback) === 'function') {
			  callback(err, data, self);
			}
		  });
		} else if (typeof(callback) === 'function') {
		  callback(err, retdata, self);
		}
	  }
	});
  }

  /*
  *  refreshes the entity by making a GET call back to the database
  *
  *  @method fetch
  *  @public
  *  @param {function} callback
  *  @return {callback} callback(err, data)
  */
  Baas.Entity.prototype.fetch = function (callback) {
	var type = this.get('type');
	var self = this;

	//if a uuid is available, use that, otherwise, use the name
	if (this.get('uuid')) {
	  type += '/' + this.get('uuid');
	} else {
	  if (type === 'users') {
		if (this.get('username')) {
		  type += '/' + this.get('username');
		} else {
		  if (typeof(callback) === 'function') {
			var error = 'no_name_specified';
			if (self._client.logging) {
			  console.log(error);
			}
			return callback(true, {error:error}, self)
		  }
		}
	  } else if (type === 'a path') {

		///TODO add code to deal with the type as a path

		if (this.get('path')) {
		  type += '/' + encodeURIComponent(this.get('name'));
		} else {
		  if (typeof(callback) === 'function') {
			var error = 'no_name_specified';
			if (self._client.logging) {
			  console.log(error);
			}
			return callback(true, {error:error}, self)
		  }
		}

	  } else {
		if (this.get('name')) {
		  type += '/' + encodeURIComponent(this.get('name'));
		} else {
		  if (typeof(callback) === 'function') {
			var error = 'no_name_specified';
			if (self._client.logging) {
			  console.log(error);
			}
			return callback(true, {error:error}, self)
		  }
		}
	  }
	}
	var options = {
	  method:'GET',
	  endpoint:type
	};
	this._client.request(options, function (err, data) {
	  if (err && self._client.logging) {
		console.log('could not get entity');
	  } else {
		if (data.user) {
		  self.set(data.user);
		  self._json = JSON.stringify(data.user, null, 2);
		} else if (data.entities) {
		  if (data.entities.length) {
			var entity = data.entities[0];
			self.set(entity);
		  }
		}
	  }
	  if (typeof(callback) === 'function') {
		callback(err, data, self);
	  }
	});
  }
  
	/*
	*  deletes the entity from the database - will only delete
	*  if the object has a valid uuid
	*
	*  @method destroy
	*  @public
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*
	*/
	Baas.Entity.prototype.destroy = function (callback) {

		var type = this.get('type');

		if (Baas.Utils.isUUID(this.get('uuid'))) {
			type += '/' + this.get('uuid');
		} else {

			if (type === 'users') {
				if (this.get('username')) {
					type += '/' + this.get('username');
				} else {
					if (typeof(callback) === 'function') {
						var error = 'Error trying to delete object - no uuid specified.';
						if (self._client.logging) {
							console.log(error);
						}
						callback(true, error);
					}
				}
			} else {
				if(this.get('name')) {
					type += '/' + this.get('name');
				} else {
					if (typeof(callback) === 'function') {
						var error = 'Error trying to delete object - no uuid specified.';
						if (self._client.logging) {
							console.log(error);
						}
						callback(true, error);
					}
				}
			} 
		} 

		var self = this;
		var options = {
			method:'DELETE',
			endpoint:type
		};

		this._client.request(options, function (err, data) {
			if (err && self._client.logging) {
				console.log('entity could not be deleted');
			} else {
				self.set(null);
			}

			if (typeof(callback) === 'function') {
				callback(err, data);
			}
		});
	}


  /*
  *  connects one entity to another
  *
  *  @method connect
  *  @public
  *  @param {string} connection
  *  @param {object} entity
  *  @param {function} callback
  *  @return {callback} callback(err, data)
  *
  */
  Baas.Entity.prototype.connect = function (connection, entity, callback) {

	var self = this;

	//connectee info
	var connecteeType = entity.get('type');
	var connectee = this.getEntityId(entity);
	if (!connectee) {
	  if (typeof(callback) === 'function') {
		var error = 'Error trying to delete object - no uuid specified.';
		if (self._client.logging) {
		  console.log(error);
		}
		callback(true, error);
	  }
	  return;
	}

	//connector info
	var connectorType = this.get('type');
	var connector = this.getEntityId(this);
	if (!connector) {
	  if (typeof(callback) === 'function') {
		var error = 'Error in connect - no uuid specified.';
		if (self._client.logging) {
		  console.log(error);
		}
		callback(true, error);
	  }
	  return;
	}

	var endpoint = connectorType + '/' + connector + '/' + connection + '/' + connecteeType + '/' + connectee;
	var options = {
	  method:'POST',
	  endpoint:endpoint
	};
	this._client.request(options, function (err, data) {
	  if (err && self._client.logging) {
		console.log('entity could not be connected');
	  }
	  if (typeof(callback) === 'function') {
		callback(err, data);
	  }
	});
  }

  /*
  *  returns a unique identifier for an entity
  *
  *  @method connect
  *  @public
  *  @param {object} entity
  *  @param {function} callback
  *  @return {callback} callback(err, data)
  *
  */
  Baas.Entity.prototype.getEntityId = function (entity) {
	var id = false;
	if (Baas.Utils.isUUID(entity.get('uuid'))) {
	  id = entity.get('uuid');
	} else {
	  if (type === 'users') {
		id = entity.get('username');
	  } else if (entity.get('name')) {
		id = entity.get('name');
	  }
	}
	return id;
  }

  /*
  *  gets an entities connections
  *
  *  @method getConnections
  *  @public
  *  @param {string} connection
  *  @param {object} entity
  *  @param {function} callback
  *  @return {callback} callback(err, data, connections)
  *
  */
  Baas.Entity.prototype.getConnections = function (connection, callback) {

	var self = this;

	//connector info
	var connectorType = this.get('type');
	var connector = this.getEntityId(this);
	if (!connector) {
	  if (typeof(callback) === 'function') {
		var error = 'Error in getConnections - no uuid specified.';
		if (self._client.logging) {
		  console.log(error);
		}
		callback(true, error);
	  }
	  return;
	}

	var endpoint = connectorType + '/' + connector + '/' + connection + '/';
	var options = {
	  method:'GET',
	  endpoint:endpoint
	};
	this._client.request(options, function (err, data) {
	  if (err && self._client.logging) {
		console.log('entity could not be connected');
	  }

	  self[connection] = {};

	  var length = data.entities.length;
	  for (var i=0;i<length;i++)
	  {
		if (data.entities[i].type === 'user'){
		  self[connection][data.entities[i].username] = data.entities[i];
		} else {
		  self[connection][data.entities[i].name] = data.entities[i]
		}
	  }

	  if (typeof(callback) === 'function') {
		callback(err, data, data.entities);
	  }
	});

  }

  /*
  *  disconnects one entity from another
  *
  *  @method disconnect
  *  @public
  *  @param {string} connection
  *  @param {object} entity
  *  @param {function} callback
  *  @return {callback} callback(err, data)
  *
  */
  Baas.Entity.prototype.disconnect = function (connection, entity, callback) {

	var self = this;

	//connectee info
	var connecteeType = entity.get('type');
	var connectee = this.getEntityId(entity);
	if (!connectee) {
	  if (typeof(callback) === 'function') {
		var error = 'Error trying to delete object - no uuid specified.';
		if (self._client.logging) {
		  console.log(error);
		}
		callback(true, error);
	  }
	  return;
	}

	//connector info
	var connectorType = this.get('type');
	var connector = this.getEntityId(this);
	if (!connector) {
	  if (typeof(callback) === 'function') {
		var error = 'Error in connect - no uuid specified.';
		if (self._client.logging) {
		  console.log(error);
		}
		callback(true, error);
	  }
	  return;
	}

	var endpoint = connectorType + '/' + connector + '/' + connection + '/' + connecteeType + '/' + connectee;
	var options = {
	  method:'DELETE',
	  endpoint:endpoint
	};
	this._client.request(options, function (err, data) {
	  if (err && self._client.logging) {
		console.log('entity could not be disconnected');
	  }
	  if (typeof(callback) === 'function') {
		callback(err, data);
	  }
	});
  }
	/*
	*  The Collection class models Baas Collections.  It essentially
	*  acts as a container for holding Entity objects, while providing
	*  additional funcitonality such as paging, and saving
	*
	*  @constructor
	*  @param {string} options - configuration object
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*/
	Baas.Collection = function(options, callback) {

		if (options) {
			this._client = options.client;
			this._type = options.type;
			this.qs = options.qs || {};

			//iteration
			this._list = options.list || [];
			this._iterator = options.iterator || -1; //first thing we do is increment, so set to -1

			//paging
			this._previous = options.previous || [];
			this._next = options.next || null;
			this._cursor = options.cursor || null;

			//restore entities if available
			if (options.list) {
				var count = options.list.length;
				for(var i=0;i<count;i++){
					//make new entity with
					var entity = this._client.restoreEntity(options.list[i]);
					this._list[i] = entity;
				}
			}
		}
		if (callback) {
			//populate the collection
			this.fetch(callback);
		}

	}


	/*
	 *  gets the data from the collection object for serialization
	 *
	 *  @method serialize
	 *  @return {object} data
	 */
	Baas.Collection.prototype.serialize = function () {

		//pull out the state from this object and return it
		var data = {}
		data.type = this._type;
		data.qs = this.qs;
		data.iterator = this._iterator;
		data.previous = this._previous;
		data.next = this._next;
		data.cursor = this._cursor;

		this.resetEntityPointer();
		var i=0;
		data.list = [];
		while(this.hasNextEntity()) {
			var entity = this.getNextEntity();
			data.list[i] = entity.serialize();
			i++;
		}

		data = JSON.stringify(data);
		return data;
	}

	/*
	*  Populates the collection from the server
	*
	*  @method fetch
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*/
	Baas.Collection.prototype.fetch = function (callback) {
		var self = this;
		var qs = this.qs;

		//add in the cursor if one is available
		if (this._cursor) {
			qs.cursor = this._cursor;
		} else {
			delete qs.cursor;
		}
		var options = {
			method:'GET',
			endpoint:this._type,
			qs:this.qs
		};
		this._client.request(options, function (err, data) {
			if(err && self._client.logging) {
			 console.log('error getting collection');
			} else {
				//save the cursor if there is one
				var cursor = data.cursor || null;
				self.saveCursor(cursor);
				if (data.entities) {
					self.resetEntityPointer();
					var count = data.entities.length;
					//save entities locally
					self._list = []; //clear the local list first
					for (var i=0;i<count;i++) {
						var uuid = data.entities[i].uuid;
						if (uuid) {
							var entityData = data.entities[i] || {};
							var entityOptions = {
								type:self._type,
								client:self._client,
								uuid:uuid,
								data:entityData
							};
							var ent = new Baas.Entity(entityOptions);
							var ct = self._list.length;
							self._list[ct] = ent;
						}
					}
				}
			}
			if (typeof(callback) === 'function') {
				callback(err, data);
			}
		});
	}

	/*
	*  Adds a new Entity to the collection (saves, then adds to the local object)
	*
	*  @method addNewEntity
	*  @param {object} entity
	*  @param {function} callback
	*  @return {callback} callback(err, data, entity)
	*/
	Baas.Collection.prototype.addEntity = function (options, callback) {
		var self = this;
		options.type = this._type;

		//create the new entity
		this._client.createEntity(options, function (err, entity) {
			if (!err) {
				//then add the entity to the list
				var count = self._list.length;
				self._list[count] = entity;
			}
			if (typeof(callback) === 'function') {
				callback(err, entity);
			}
		});
	}

	/*
	*  Removes the Entity from the collection, then destroys the object on the server
	*
	*  @method destroyEntity
	*  @param {object} entity
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*/
	Baas.Collection.prototype.destroyEntity = function (entity, callback) {
		var self = this;
		entity.destroy(function(err, data) {
			if (err) {
				if (self._client.logging) {
					console.log('could not destroy entity');
				}
				if (typeof(callback) === 'function') {
					callback(err, data);
				}
			} else {
				//destroy was good, so repopulate the collection
				self.fetch(callback);
			}
		});
	}

	/*
	*  Looks up an Entity by UUID
	*
	*  @method getEntityByUUID
	*  @param {string} UUID
	*  @param {function} callback
	*  @return {callback} callback(err, data, entity)
	*/
	Baas.Collection.prototype.getEntityByUUID = function (uuid, callback) {
		//get the entity from the database
		var options = {
			data: {
				type: this._type,
				uuid:uuid
			},
			client: this._client
		}
		var entity = new Baas.Entity(options);
		entity.fetch(callback);
	}

	/*
	*  Returns the first Entity of the Entity list - does not affect the iterator
	*
	*  @method getFirstEntity
	*  @return {object} returns an entity object
	*/
	Baas.Collection.prototype.getFirstEntity = function () {
		var count = this._list.length;
		if (count > 0) {
			return this._list[0];
		}
		return null;
	}

	/*
	*  Returns the last Entity of the Entity list - does not affect the iterator
	*
	*  @method getLastEntity
	*  @return {object} returns an entity object
	*/
	Baas.Collection.prototype.getLastEntity = function () {
		var count = this._list.length;
		if (count > 0) {
			return this._list[count-1];
		}
		return null;
	}

	/*
	*  Entity iteration -Checks to see if there is a "next" entity
	*  in the list.  The first time this method is called on an entity
	*  list, or after the resetEntityPointer method is called, it will
	*  return true referencing the first entity in the list
	*
	*  @method hasNextEntity
	*  @return {boolean} true if there is a next entity, false if not
	*/
	Baas.Collection.prototype.hasNextEntity = function () {
		var next = this._iterator + 1;
		var hasNextElement = (next >=0 && next < this._list.length);
		if(hasNextElement) {
			return true;
		}
		return false;
	}

	/*
	*  Entity iteration - Gets the "next" entity in the list.  The first
	*  time this method is called on an entity list, or after the method
	*  resetEntityPointer is called, it will return the,
	*  first entity in the list
	*
	*  @method hasNextEntity
	*  @return {object} entity
	*/
	Baas.Collection.prototype.getNextEntity = function () {
		this._iterator++;
		var hasNextElement = (this._iterator >= 0 && this._iterator < this._list.length);
		if(hasNextElement) {
			return this._list[this._iterator];
		}
		return false;
	}

	/*
	*  Entity iteration - Checks to see if there is a "previous"
	*  entity in the list.
	*
	*  @method hasPrevEntity
	*  @return {boolean} true if there is a previous entity, false if not
	*/
	Baas.Collection.prototype.hasPrevEntity = function () {
		var previous = this._iterator - 1;
		var hasPreviousElement = (previous >=0 && previous < this._list.length);
		if(hasPreviousElement) {
			return true;
		}
		return false;
	}

	/*
	*  Entity iteration - Gets the "previous" entity in the list.
	*
	*  @method getPrevEntity
	*  @return {object} entity
	*/
	Baas.Collection.prototype.getPrevEntity = function () {
		 this._iterator--;
		 var hasPreviousElement = (this._iterator >= 0 && this._iterator <= this._list.length);
		 if(hasPreviousElement) {
			return this._list[this._iterator];
		 }
		 return false;
	}

	/*
	*  Entity iteration - Resets the iterator back to the beginning
	*  of the list
	*
	*  @method resetEntityPointer
	*  @return none
	*/
	Baas.Collection.prototype.resetEntityPointer = function () {
		 this._iterator  = -1;
	}

	/*
	* Method to save off the cursor just returned by the last API call
	*
	* @public
	* @method saveCursor
	* @return none
	*/
	Baas.Collection.prototype.saveCursor = function(cursor) {
		//if current cursor is different, grab it for next cursor
		if (this._next !== cursor) {
			this._next = cursor;
		}
	}

	/*
	* Resets the paging pointer (back to original page)
	*
	* @public
	* @method resetPaging
	* @return none
	*/
	Baas.Collection.prototype.resetPaging = function() {
		this._previous = [];
		this._next = null;
		this._cursor = null;
	}

	/*
	*  Paging -  checks to see if there is a next page od data
	*
	*  @method hasNextPage
	*  @return {boolean} returns true if there is a next page of data, false otherwise
	*/
	Baas.Collection.prototype.hasNextPage = function () {
		return (this._next);
	}

	/*
	*  Paging - advances the cursor and gets the next
	*  page of data from the API.  Stores returned entities
	*  in the Entity list.
	*
	*  @method getNextPage
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*/
	Baas.Collection.prototype.getNextPage = function (callback) {
		if (this.hasNextPage()) {
			//set the cursor to the next page of data
			this._previous.push(this._cursor);
			this._cursor = this._next;
			//empty the list
			this._list = [];
			this.fetch(callback);
		} else {
			callback(true)
		}
	}

	/*
	*  Paging -  checks to see if there is a previous page od data
	*
	*  @method hasPreviousPage
	*  @return {boolean} returns true if there is a previous page of data, false otherwise
	*/
	Baas.Collection.prototype.hasPreviousPage = function () {
		return (this._previous.length > 0);
	}

	/*
	*  Paging - reverts the cursor and gets the previous
	*  page of data from the API.  Stores returned entities
	*  in the Entity list.
	*
	*  @method getPreviousPage
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*/
	Baas.Collection.prototype.getPreviousPage = function (callback) {
		if (this.hasPreviousPage()) {
			this._next=null; //clear out next so the comparison will find the next item
			this._cursor = this._previous.pop();
			//empty the list
			this._list = [];
			this.fetch(callback);
		} else {
			callback(true)
		}
	}
  /*
   *  A class to model a Baas group.
   *  Set the path in the options object.
   *
   *  @constructor
   *  @param {object} options {client:client, data: {'key': 'value'}, path:'path'}
   */
  Baas.Group = function(options) {
    this._path = options.path;
    this._list = [];
    this._client = options.client;
    this._data = options.data || {};
    this._data.type = "groups";
  }

  /*
   *  Inherit from Baas.Entity.
   *  Note: This only accounts for data on the group object itself.
   *  You need to use add and remove to manipulate group membership.
   */
  Baas.Group.prototype = new Baas.Entity();

  /*
  *  Fetches current group data, and members.
  *
  *  @method fetch
  *  @public
  *  @param {function} callback
  *  @returns {function} callback(err, data)
  */
  Baas.Group.prototype.fetch = function(callback) {
    var self = this;
    var groupEndpoint = 'groups/'+this._path;
    var memberEndpoint = 'groups/'+this._path+'/users';

    var groupOptions = {
      method:'GET',
      endpoint:groupEndpoint
    }

    var memberOptions = {
      method:'GET',
      endpoint:memberEndpoint
    }

    this._client.request(groupOptions, function(err, data){
      if(err) {
        if(self._client.logging) {
          console.log('error getting group');
        }
        if(typeof(callback) === 'function') {
          callback(err, data);
        }
      } else {
        if(data.entities) {
          var groupData = data.entities[0];
          self._data = groupData || {};
          self._client.request(memberOptions, function(err, data) {
            if(err && self._client.logging) {
              console.log('error getting group users');
            } else {
              if(data.entities) {
                var count = data.entities.length;
                self._list = [];
                for (var i = 0; i < count; i++) {
                  var uuid = data.entities[i].uuid;
                  if(uuid) {
                    var entityData = data.entities[i] || {};
                    var entityOptions = {
                      type: entityData.type,
                      client: self._client,
                      uuid:uuid,
                      data:entityData
                    };
                    var entity = new Baas.Entity(entityOptions);
                    self._list.push(entity);
                  }

                }
              }
            }
            if(typeof(callback) === 'function') {
              callback(err, data, self._list);
            }
          });
        }
      }
    });
  }

  /*
   *  Retrieves the members of a group.
   *
   *  @method members
   *  @public
   *  @param {function} callback
   *  @return {function} callback(err, data);
   */
  Baas.Group.prototype.members = function(callback) {
    if(typeof(callback) === 'function') {
      callback(null, this._list);
    }
  }

  /*
   *  Adds a user to the group, and refreshes the group object.
   *
   *  Options object: {user: user_entity}
   *
   *  @method add
   *  @public
   *  @params {object} options
   *  @param {function} callback
   *  @return {function} callback(err, data)
   */
  Baas.Group.prototype.add = function(options, callback) {
    var self = this;
    var options = {
      method:"POST",
      endpoint:"groups/"+this._path+"/users/"+options.user.get('username')
    }

    this._client.request(options, function(error, data){
      if(error) {
        if(typeof(callback) === 'function') {
          callback(error, data, data.entities);
        }
      } else {
        self.fetch(callback);
      }
    });
  }

  /*
   *  Removes a user from a group, and refreshes the group object.
   *
   *  Options object: {user: user_entity}
   *
   *  @method remove
   *  @public
   *  @params {object} options
   *  @param {function} callback
   *  @return {function} callback(err, data)
   */
  Baas.Group.prototype.remove = function(options, callback) {
    var self = this;

    var options = {
      method:"DELETE",
      endpoint:"groups/"+this._path+"/users/"+options.user.get('username')
    }

    this._client.request(options, function(error, data){
      if(error) {
        if(typeof(callback) === 'function') {
          callback(error, data);
        }
      } else {
        self.fetch(callback);
      }
    });
  }

  /*
  * Gets feed for a group.
  *
  * @public
  * @method feed
  * @param {function} callback
  * @returns {callback} callback(err, data, activities)
  */
  Baas.Group.prototype.feed = function(callback) {
    var self = this;

    var endpoint = "groups/"+this._path+"/feed";

    var options = {
      method:"GET",
      endpoint:endpoint
    }

    this._client.request(options, function(err, data){
      if (err && self.logging) {
        console.log('error trying to log user in');
      }
      if(typeof(callback) === 'function') {
          callback(err, data, data.entities);
      }
    });
  }

  /*
  * Creates activity and posts to group feed.
  *
  * options object: {user: user_entity, content: "activity content"}
  *
  * @public
  * @method createGroupActivity
  * @params {object} options
  * @param {function} callback
  * @returns {callback} callback(err, entity)
  */
  Baas.Group.prototype.createGroupActivity = function(options, callback){
    var user = options.user;
    var options = {
      actor: {
        "displayName":user.get("username"),
        "uuid":user.get("uuid"),
        "username":user.get("username"),
        "email":user.get("email"),
        "picture":user.get("picture"),
        "image": {
          "duration":0,
          "height":80,
          "url":user.get("picture"),
          "width":80
         },
      },
      "verb":"post",
      "content":options.content };

      options.type = 'groups/'+this._path+'/activities';
      var options = {
        client:this._client,
        data:options
      }

      var entity = new Baas.Entity(options);
      entity.save(function(err) {
        if (typeof(callback) === 'function') {
          callback(err, entity);
        }
      });
  }
  
  /*
   *  A class to model a Baas Notification.
   *  Set the path in the options object.
   *
   *  @constructor
   *  @param {object} options {client:client, data: {'key': 'value'}, path:'path'}
   */
  Baas.Push = function(options) {

    if(options){
      this._client = options.client;
      this._data = options.data || {};
      this._data.type = "pushes";
    }
  }

  Baas.Push.prototype = new Baas.Entity();

  /**
  *  Push Message Send
  *
  *  @method fetch
  *  @public
  *  @param {object} options
  *  @param {function} callback(err, data, entity)
  */
  Baas.Push.prototype.send = function(options, callback){

    var type = this.get('type');
    var method = 'POST';

    //update the entity
    var self = this;

    var data = {};
    var entityData = this.get();

    //options check
    if(typeof options !== 'object' || !options){
      callback(true, {'error_code':100 , 'error_description' : 'not type of options'})
      return;
    }

    var platform = options.platform;
    var reserve = options.reserve;

    var target = options.target;
    var to = options.to;
    var payload = options.payload;

    //options target check
    if(typeof target === 'string'){
      if(!(target === 'all' || target === 'user' || target === 'device' || target ==='tag')){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid target parameter'});
        return;
      }
    } else {
      callback(true, {'error_code':100 , 'error_description' : 'Bad request'});
      return;
    }

    //options.to check
    if(typeof to === 'string'){
      if(target === 'user' && !Baas.Utils.isUUID(to)){
        callback(true, {'error_code':100, 'error_description' : 'Invalid UUID string:' + to});
        return
      }
      if(target === 'device' && to === ''){
        callback(true, {'error_code':620, 'error_description' : 'Not existed devices'});
        return
      }
      if(target === 'tag' && to === ''){
        callback(true, {'error_code':620, 'error_description' : 'Push to is null'});
        return
      }
    } else {
      if(target !== 'all'){
        callback(true, {'error_code':100, 'error_description' : 'Bad request'});
        return
      }
    }

    //options.to check
    if(!payload){
      callback(true, {'error_code':100, 'error_description' : 'Bad request'});
      return;
    } else if(typeof payload === 'string' || typeof payload === 'number' || (typeof payload === 'object' && payload instanceof Array)){
      callback(true, {'error_code':100, 'error_description' : 'Invalid payload.badge type'});
      return;
    }

    //options.payload.alert check
    if(!payload.alert || typeof payload.alert !== 'string'){
      callback(true, {'error_code':100, 'error_description' : 'Bad request'});
      return;
    }

    // badge check
    if(!payload.badge){
      if(payload.badge !== undefined){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid payload.badge parameter'})
        return;
      }
    } else {
      // badge is not number
      if(typeof payload.badge !== 'number'){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid payload.badge type'})
        return;
      }
    }

    // sound check
    if(!payload.sound){
      if(payload.sound !== undefined){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid payload.sound parameter'})
        return;
      }
    } else {
      if(typeof payload.sound !== 'string'){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid payload.sound type'})
        return;
      }
    }

    // platform check
    if(!platform){
      if(platform !== undefined){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid platform parameter'})
        return;
      }
    } else {
      if(typeof platform !== 'string'){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid platform type'})
        //return;
      }
      if(!(platform === 'I' || platform === 'G')){
        callback(true, {'error_code':620 , 'error_description' : 'Device platform invalid regxp'})
        return;
      }
    }

    // reserve check
    if(!reserve){
      if(reserve !== undefined){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid reserve parameter'})
        return;
      }
    } else {
      if(typeof reserve !== 'string'){
        callback(true, {'error_code':100 , 'error_description' : 'Invalid reserve type'})
        return;
      }
      if(reserve.length !== 12 || isNaN(reserve)){
        callback(true, {'error_code':620 , 'error_description' : 'Push reserve invalid regxp'})
        //return;
      }
    }

    for (var item in entityData) {
      if (item === 'metadata' || item === 'created' || item === 'modified' ||
          item === 'type' || item === 'activated' || item ==='uuid') { continue; }
      data[item] = entityData[item];
    }

    //remove system specific properties
    for (var item in options) {
      if(item === 'to' && target === 'all') {continue;}
      data[item] = options[item];
    }

    var options =  {
      method:method,
      endpoint:type,
      body:data
    };

    this._client.request(options, function(err, retdata){
      if(err) {
        if(self._client.logging) {
          console.log('error getting push');
        }
      } else {
        if (retdata.entities) {
          if (retdata.entities.length) {
            var entity = retdata.entities[0];
            self.set(entity);
          }
        }
      }

      if(typeof(callback) === 'function') {
        callback(err, retdata, self);
      }
    }) 
  }
	
	/*
	 *  A class to model a Baas File.
	 *  Set the path in the options object.
	 *
	 *  @constructor
	 *  @param {object} options {client:client, data: {'key': 'value'}}
	 */
	Baas.File = function(options) {

		if(options){
			this._client = options.client;
			this._data = options.data || {};
			this._data.type = "files";
			this._data.minsize = options.minsize || 1;
			this._data.maxsize = options.maxsize || 10485760;
			this._data.allowExts = options.allowExts || "";
			this.count = 0;
		}
	}

	/*
	 *  Inherit from Baas.Entity.
	 *  Note: This only accounts for data on the file object itself.\
	 */
	Baas.File.prototype = new Baas.Entity();

	/*
	 *  Upload files and Create file Entity
	 *  
	 *  @method save
	 *  @public
	 *  @param {object} fileObj
	 *  @param {function} callback
	 *  @return {callback} callback(err, data, entity)
	 */
	Baas.File.prototype.upload = function(fileObj, callback){

		var type = this.get('type');

		var fileNameRegex = /<|>|"|\\/;

		var self = this;

		var formData = new FormData();

		var fileSize = fileObj.file[0].files[self.count].size;
		var fileName = fileObj.file[0].files[self.count].name;

		// fileSize Check
		if(fileSize < this._data.minsize  || fileSize > this._data.maxsize){
			callback(true, {'error_code':100, 'error_description' : 'min : 1byte, max : 10MB'});
			return
		} else if(fileNameRegex.test(fileName)){
			callback(true, {'error_code':100, 'error_description' : 'Invalid file name'});
			return 
		}

		//file ext check
		if(this.get('allowExts')){
			var allowExts = (this.get('allowExts')).toLowerCase().split(",");

			if(fileName.length > 0){
				var lidx = fileName.lastIndexOf(".");
				var fext = fileName.substring(lidx+1).toLowerCase();  
			}
			
			var checkCount = 0;

			if(fext && fext.length > 0){
				for(var i=0;i<allowExts.length;i++){
					var ext = allowExts[i].toLowerCase();
					if(fext == ext){
						checkCount+=1;
					}
				}
			}

			if(checkCount === 0) {
				callback(true, {'error_code':100, 'error_description' : 'Invalid file ext'});
				return;
			}
		}

		formData.append("file" , fileObj.file[0].files[self.count]);    

		var options =  {
			method:'POST',
			endpoint:type,
			body:formData
		};

		this._client.request(options, function(err, retdata){
			if(err) {
				if(self._client.logging) {
					console.log('error getting push');
				}
				if(typeof(callback) === 'function') {
					callback(err, retdata);
				}
			} else {
				if (retdata.entities) {
					if (retdata.entities.length) {
						var entity = retdata.entities[0];
						self.set(entity);
					}
				}
				callback(err, retdata, self);
			}
		});
	}
	
	/*
	 *  download files
	 *
	 *  @param {function} callback
	 *  @return {callback} callback(err, data, entity)
	 */
	Baas.File.prototype.download = function(callback){

		var type = 'files/' + this.get('uuid') + '/data';

		var self = this;

		var options =  {
			method:'GET',
			endpoint:type
		};

		this._client.request(options, function (err, retdata){
			if(err) {
				if(self._client.logging) {
					console.log('error getting push');
				}
				if(typeof(callback) === 'function') {
					callback(err, self);
				}
			} else {
				callback(err, self);
				window.location = self.getDownloadURL();
			}
		});
	}

	/*
	*  Saves the entity back to the database
	*
	*  @method save
	*  @public
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*/
	Baas.File.prototype.save = function (callback) {
		//TODO:  API will be changed soon to accomodate PUTs via name which create new entities
		//       This function should be changed to PUT only at that time, and updated to use
		//       either uuid or name
		var type = this.get('type');
		var method = 'POST';
		if (Baas.Utils.isUUID(this.get('uuid'))) {
			method = 'PUT';
			type += '/' + this.get('uuid');
		} else {
			method = 'PUT';
			type += '/' + this.get('username');
		}

		//update the entity
		var self = this;
		var data = {};
		var entityData = this.get();
		//remove system specific properties
		for (var item in entityData) {
			if (item === 'metadata' || item === 'created' || item === 'modified' ||
					item === 'type' || item === 'activated' || item ==='uuid' || item ==='minsize' || item ==='maxsize') { continue; }
			data[item] = entityData[item];
		}
		var options =  {
			method:method,
			endpoint:type,
			body:data
		};
		//save the entity first
		this._client.request(options, function (err, retdata) {
			if (err && self._client.logging) {
				console.log('could not save entity');
				if (typeof(callback) === 'function') {
					return callback(err, retdata, self);
				}
			} else {
				if (retdata.entities) {
					if (retdata.entities.length) {
						var entity = retdata.entities[0];
						self.set(entity);
					}
				}
				callback(err, retdata, self);
			}
		});
	}

	/*
	*  refreshes the entity by making a GET call back to the database
	*
	*  @method fetch
	*  @public
	*  @param {function} callback
	*  @return {callback} callback(err, data)
	*/
	Baas.File.prototype.fetch = function (callback) {
		var type = this.get('type');
		var self = this;

		//if a uuid is available, use that, otherwise, use the name
		if (this.get('uuid')) {
			type += '/' + this.get('uuid');
		} else {
			if (typeof(callback) === 'function') {
				var error = 'no_uuid_specified';
				if (self._client.logging) {
					console.log(error);
				}
				return callback(true, {error:error}, self)
			}
		}

		var options = {
			method:'GET',
			endpoint:type
		};

		this._client.request(options, function (err, data) {
			if (err && self._client.logging) {
				console.log('could not get entity');
			} else {
					if (data.entities.length) {
						var entity = data.entities[0];
						self.set(entity);
					}
			}
			if (typeof(callback) === 'function') {
				callback(err, data, self);
			}
		});
	}

	/**
	 * html markup use file download url
	 *
	 * @method getDownloadURL
	 * @return {string} url
	 */
	Baas.File.prototype.getDownloadURL = function(){
		return this._client.URI + '/' + this._client.orgName + '/' + this._client.appName + '/' + this.get('type') + '/' + this.get('uuid') + '/data'
	}
  
  /*
   *  A class to model a Baas Utils.
   */
  Baas.Utils = (function () {

    /*
    * Tests if the string is a uuid
    *
    * @public
    * @method isUUID
    * @param {string} uuid The string to test
    * @returns {Boolean} true if string is uuid
    */
    function isUUID(uuid){
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
     function encodeParams(params){
      tail = [];
      var item = [];
      if (params instanceof Array) {
        for (i in params) {
          item = params[i];
          if ((item instanceof Array) && (item.length > 1)) {
            tail.push(item[0] + "=" + encodeURI(item[1]));
          }
        }
      } else {
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            var value = params[key];
            if (value instanceof Array) {
              for (i in value) {
                item = value[i];
                tail.push(key + "=" + encodeURI(item));
              }
            } else {
              tail.push(key + "=" + encodeURI(value));
            }
          }
        }
      }
      return tail.join("&");
    }

    return{
      isUUID:isUUID,
      encodeParams:encodeParams
    }
  })()

  
  
  


})();