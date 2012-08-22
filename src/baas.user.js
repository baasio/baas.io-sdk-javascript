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

		isCurrent: function() {},
		getEmail: function() {},
		getUserName: function() {},
		login: function() {},
		logout: function() {
    		ApiClient.logoutAppUser();
		},
		setEmail: function(email) {
			this.setField('email', email);
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
		setUsername: function() {},
		
	});
}(this));