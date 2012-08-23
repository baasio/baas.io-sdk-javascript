// Parse.Query is a way to create a list of Baas.Objects.
(function(root) {
  root.Baas = root.Baas || {};
  var Baas = root.Baas,
    ApiClient = Baas.ApiClient;

  Baas.Role = function(path, uuid) {
    // return _collection;
  }

  _.extend(Baas.Collection.prototype, {
    save: function(entity, successCallback, errorCallback) {
      this._instance.addEntity(entity);
      this._instance.save(successCallback, errorCallback);
    },

    fetch: function(successCallback, errorCallback) {
      this._instance.get(successCallback, errorCallback);
    },

    remove: function(entity, successCallback, errorCallback) {
      var path = this._instance.getPath();
      this._instance._queryObj.setAll('DELETE', path +'/'+ entity._uuid, null, null, successCallback, errorCallback);
      
      ApiClient.runAppQuery(this._instance._queryObj);
    },

    getEntities: function() {
      return this._instance.getEntityList();
    },

    setQuery: function(obj) {
      var path = this._instance.getPath();
      var queryParam = this.Query.merge(obj || {});

      this._instance.setQueryParams(queryParam);
    },

    /**
     * TODO: 지정된 파라미터만 전송하도록 
     * http://apigee.com/docs/usergrid/content/general-purpose-endpoints
     */
    adjust: function(data, successCallback, errorCallback) {
      var path = this._instance.getPath();
      this._instance._queryObj.setAll('PUT', path, data, null, successCallback, errorCallback);
      
      ApiClient.runAppQuery(this._instance._queryObj);
    }
  });

}(this));