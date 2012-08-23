// Parse.Query is a way to create a list of Baas.Objects.
(function(root) {
  root.Baas = root.Baas || {};
  var Baas = root.Baas,
    ApiClient = Baas.ApiClient;

  // Baas.Collection = apigee.Collection;

  // _.extend(Baas.Collection.prototype, {

    /**
     * 앱에서 유동적으로 컬렉션을 생성할만한 목적성이 있는지 판단이 필요함
     */
    // create: function() {},
    // save: function(data, successCallback, errorCallback) {

    // }
  // });

  Baas.Collection = function(path, uuid) {
    this.Query = (function() {
      var _obj = {};

      return {
        get: function() {
          return _obj;
        },

        merge: function(obj) {
          var prop,
              defaultObj = {
                ql: null,
                reversed: null,
                start: null,
                cursor: null,
                limit: null,
                permission: null,
                filter: null
              };

          for(prop in obj) {
            defaultObj[prop] = obj[prop];

            //delete undefined value
            if(defaultObj[prop] == null) {
              delete defaultObj[prop];
            }
          }
          _obj = defaultObj;

          return defaultObj;
        },

        sort: function(key, order) {
          order = order || "desc";
          _obj.ql = "order by "+ key +" "+ order;
        },

        reverse: function() {},
        start: function() {},
        cursor: function() {},
        limit: function() {},
        permission: function() {},
        filter: function() {}
      }
    }());
    
    this._instance = new apigee.Collection(path, uuid);

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