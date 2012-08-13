// Parse.Query is a way to create a list of Baas.Objects.
(function(root) {
	root.Baas = root.Baas || {};
	var Baas = root.Baas,
		ApiClient = Baas.ApiClient;

	Baas.User = apigee.User;

	_.extend(Baas.User.prototype, Baas.Event, {
		login: function(){
		},
		logout: null,
	});
}(this));