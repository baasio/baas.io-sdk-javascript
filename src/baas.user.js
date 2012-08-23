// Parse.Query is a way to create a list of Baas.Objects.
(function(root) {
	root.Baas = root.Baas || {};
	var Baas = root.Baas,
		ApiClient = Baas.ApiClient,
		QueryObj = Baas.QueryObj;;

	// Baas.User = apigee.User;

	Baas.User = function(attr) {
		var prop;
		attr = attr || {};

		for(prop in attr) {
			this.setField(prop, attr[prop]);
		}
	}

	Baas.User.create = function(attr, options) {
		var name, email, username, password;
		options = options || {};

		name = attr.username;
		email = attr.email;
		username = attr.username;
		password = attr.password;

		ApiClient.createAppUser(name, email, username, password, null,
	        options.success,
	        options.error
	    );

	    return new Baas.User(attr);
	}

	Baas.User.get = function(attr, options) {
		var path, username;
		options = options || {};

		username = attr.username;
		path = 'users/'+ username;

	    ApiClient.runAppQuery(new QueryObj('GET', path, null, null,
	      options.success,
	      options.error
        ));	
	}

	Baas.User.login = function(username, password, options) {
		options = options || {};
		ApiClient.loginAppUser(username, password, options.success, options.error);
	}

	Baas.User.query = function(query, options) {
		query = query || {};
		options = options || {};

	    ApiClient.runAppQuery(new QueryObj('GET', 'users', null, query,
	      options.success,
	      options.error
        ));
	}

	// Baas.User.relationBy = function(username, relationship, query, options) {
	// 	var path;
	// 	query = query || {};
	// 	options = options || {};

	// 	path = 'users/'+ username +'/'+ relationship;

	//     ApiClient.runAppQuery(new QueryObj('GET', path, null, query,
	//       options.success,
	//       options.error
 //        ));
	// }

  	Baas.User.prototype = new apigee.Entity();

	_.extend(Baas.User.prototype, {
		save: function(attr, options) {
			var prop, username, data, path;
			attr = attr || {};
			options = options || {};

			for(prop in attr) {
				this.setField(prop, attr[prop]);
			}

			data = attr || this.getData();
			username = ApiClient.getAppUserUsername() || attr.username;
			path = 'users/'+ username;

		    ApiClient.runAppQuery(new QueryObj('PUT', path, data, null,
		      options.success,
		      options.error
	        ));	
		},
		getUserName: function() {
			return ApiClient.getAppUserUsername();
		},
		setUsername: function() {
			ApiClient.setAppUserUsername(email);
		},
		login: function(options) {
			var username, password
			options = options || {};
			username = this.getUserName();
			password = this.getField('password');

			Baas.User.login(username, password, options);
		},
		logout: function() {
    		ApiClient.logoutAppUser();
		},
		getEmail: function() {
			return ApiClient.getAppUserEmail();
		},
		setEmail: function(email) {
			ApiClient.setAppUserEmail(email);
		},
		setPassword: function(attr, options) {
			var newpasswd, oldpasswd, username, path;
			options = options || {};

			attr = attr || {};
			username = ApiClient.getAppUserUsername();
			path = 'users/'+ username +'/password';

		    ApiClient.runAppQuery(new QueryObj('POST', path, attr, null,
		      options.success,
		      options.error
	        ));	
		},

		/**
		 * 나는 앱을 떠난다.
		 */
		leaveFromApp: function(options) {
			var options = options || {};
			Baas.App.leave(options);
		},

		/**
		 * 나와 어떤 관계를 맺는 사용자를 보여달라.
		 */
		relatedBy: function(relationship, query, options) {
			var username, path;
			query = query || {};
			options = options || {};

			username = ApiClient.getAppUserUsername();
			path = 'users/'+ username +'/relationship';

		    ApiClient.runAppQuery(new QueryObj('GET', path, null, query,
		      options.success,
		      options.error
	        ));
		},

		/**
		 * after v0.7.0
		 */
		follower: function() {},
		following: function() {}
		
	});
}(this));