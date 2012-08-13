// Baas.Group is a way to create a list of Baas.Objects.
(function(root) {
	root.Baas = root.Baas || {};
	var Baas = root.Baas,
		ApiClient = Baas.ApiClient,
		QueryObj = Baas.QueryObj;

	Baas.Group = (function() {

		return {
			create: function(groupName, groupPath, data, successCallback, failureCallback) {
			    var data = data || {};
			    data.title = groupName;
			    data.path = groupPath;

			    ApiClient.runAppQuery(new QueryObj('POST', 'groups', data, null,
			      function (response) {
			        if (successCallback && typeof(successCallback) == "function") {
			          successCallback(response);
			        }
			      },
			      function (response) {
			        if (failureCallback && typeof(failureCallback) == "function") {
			          failureCallback(response);
			        }
			      }
		        ));	
			},

			update: function(groupPath, data, successCallback, failureCallback) {
			    var data = data || {};
			    data.path = groupPath;

			    ApiClient.runAppQuery(new QueryObj('PUT', 'groups/'+ groupPath, data, null,
			      function (response) {
			        if (successCallback && typeof(successCallback) == "function") {
			          successCallback(response);
			        }
			      },
			      function (response) {
			        if (failureCallback && typeof(failureCallback) == "function") {
			          failureCallback(response);
			        }
			      }
		        ));	
			},
			remove: function(groupPath, data, successCallback, failureCallback) {
			    var data = data || {};
			    data.path = groupPath;

			    ApiClient.runAppQuery(new QueryObj('DELETE', 'groups/'+ groupPath, data, null,
			      function (response) {
			        if (successCallback && typeof(successCallback) == "function") {
			          successCallback(response);
			        }
			      },
			      function (response) {
			        if (failureCallback && typeof(failureCallback) == "function") {
			          failureCallback(response);
			        }
			      }
		        ));	
			},
			get: function(groupPath, data, successCallback, failureCallback) {
			    var data = data || {};
			    data.path = groupPath;

			    ApiClient.runAppQuery(new QueryObj('GET', 'groups/'+ groupPath, data, null,
			      function (response) {
			        if (successCallback && typeof(successCallback) == "function") {
			          successCallback(response);
			        }
			      },
			      function (response) {
			        if (failureCallback && typeof(failureCallback) == "function") {
			          failureCallback(response);
			        }
			      }
		        ));	
			},

			addUser: function() {},
			removeUser: function() {}	
		}
	}());
}(this));