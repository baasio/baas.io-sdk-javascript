// Baas.Collection is a way to create a list of Baas.Objects.
(function(root) {
  root.Baas = root.Baas || {};
  var Baas = root.Baas,
    ApiClient = Baas.ApiClient,
    QueryObj = Baas.QueryObj;

  Baas.Collection = (function() {

    return {
      create: function(collectionName, data, successCallback, failureCallback) {
          var data = data || {};

          ApiClient.runAppQuery(new QueryObj('POST', collectionName, data, null,
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

      update: function() {
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
      remove: function() {
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
      get: function() {
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

      addUser: function() {
          var data = data || {};
          data.path = groupPath;
          data.user = userName;

          ApiClient.runAppQuery(new QueryObj('POST', 'groups/'+ groupPath +'/users/'+ userName, data, null,
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

      removeUser: function() {
          var data = data || {};
          data.path = groupPath;
          data.user = userName;

          ApiClient.runAppQuery(new QueryObj('DELETE', 'groups/'+ groupPath +'/users/'+ userName, data, null,
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
      } 
    }
  }());
}(this));