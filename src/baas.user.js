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
			var prop;
			attr = attr || {};

			for(prop in attr) {
				this.setField(prop, attr[prop]);
			}

			ApiClient.createAppUser(name, email, username, password, null,
		        options.success,
		        options.error
		    );
		},
		isCurrent: function() {},
		getEmail: function() {},
		getUserName: function() {},
		login: function() {},
		logout: function() {},
		setEmail: function() {},
		setPassword: function(attr, options) {
			var newpasswd, oldpasswd, user, path;

			attr = attr || {};
			user = ApiClient.getAppUserUsername();
			path = 'users/'+ user +'/password';

		    ApiClient.runAppQuery(new QueryObj('POST', path, data, null,
		      options.success,
		      options.error
	        ));	
		},
		setUsername: function() {},
		
	});
}(this));