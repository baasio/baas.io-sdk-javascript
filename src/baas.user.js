// Parse.Query is a way to create a list of Baas.Objects.
(function(root) {
	root.Baas = root.Baas || {};
	var Baas = root.Baas,
		ApiClient = Baas.ApiClient;

	Baas.User = apigee.User;

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
	}

	_.extend(Baas.User.prototype, {
		isCurrent: function() {},
		getEmail: function() {},
		getUserName: function() {},
		login: function() {},
		logout: function() {},
		setEmail: function() {},
		setPassword: function() {},
		setUsername: function() {},
		
	});
}(this));