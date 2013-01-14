/**
 *  A class to Model a baasio Entity.
 *
 *  @class Entity
 *  @author Rod Simpson (rod@apigee.com)
 */
(function (baasio) {
  /**
   *  Constructor for initializing an entity
   *
   *  @constructor
   *  @param {string} collectionType - the type of collection to model
   *  @param {uuid} uuid - (optional), the UUID of the collection if it is known
   */
  baasio.Entity = function(collectionType, uuid) {
    this._collectionType = collectionType;
    this._data = {};
    if (uuid) {
      this._data['uuid'] = uuid;
    }
  };

  //inherit prototype from Query
  baasio.Entity.prototype = new baasio.Query();

  _.extend(baasio.Entity.prototype, {
    /**
     *  gets the current Entity type
     *
     *  @method getCollectionType
     *  @return {string} collection type
     */
    getCollectionType: function (){
      return this._collectionType;
    },

    /**
     *  sets the current Entity type
     *
     *  @method setCollectionType
     *  @param {string} collectionType
     *  @return none
     */
    setCollectionType: function (collectionType){
      this._collectionType = collectionType;
    },

    /**
     *  gets a specific field or the entire data object. If null or no argument
     *  passed, will return all data, else, will return a specific field
     *
     *  @method get
     *  @param {string} field
     *  @return {string} || {object} data
     */
    get: function (field){
      if (field) {
        return this._data[field];
      } else {
        return this._data;
      }
    },

    /**
     *  adds a specific field or object to the Entity's data
     *
     *  @method set
     *  @param {string} item || {object}
     *  @param {string} value
     *  @return none
     */
    set: function (item, value){
      if (typeof item === 'object') {
        for(var field in item) {
          this._data[field] = item[field];
        }
      } else if (typeof item === 'string') {
        if (value === null) {
          delete this._data[item];
        } else {
          this._data[item] = value;
        }
      } else {
        this._data = null;
      }
    },

    /**
     *  Saves the entity back to the database
     *
     *  @method save
     *  @public
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    save: function (successCallback, errorCallback){
      var path = this.getCollectionType();
      //TODO:  API will be changed soon to accomodate PUTs via name which create new entities
      //       This function should be changed to PUT only at that time, and updated to use
      //       either uuid or name
      var method = 'POST';
      if (this.isUUID(this.get('uuid'))) {
        method = 'PUT';
        path += "/" + this.get('uuid');
      }

      //if this is a user, update the password if it has been specified
      var data = {};
      if (path == 'users') {
        data = this.get();
        var pwdata = {};
        //Note: we have a ticket in to change PUT calls to /users to accept the password change
        //      once that is done, we will remove this call and merge it all into one
        if (data.oldpassword && data.newpassword) {
          pwdata.oldpassword = data.oldpassword;
          pwdata.newpassword = data.newpassword;
          this.runAppQuery(new baasio.Query('PUT', 'users/'+uuid+'/password', pwdata, null,
            function (response) {
              //not calling any callbacks - this section will be merged as soon as API supports
              //   updating passwords in general PUT call
            },
            function (response) {

            }
          ));
        }
        //remove old and new password fields so they don't end up as part of the entity object
        delete data.oldpassword;
        delete data.newpassword;
      }

      //update the entity
      var self = this;

      data = {};
      var entityData = this.get();
      //remove system specific properties
      for (var item in entityData) {
        if (item == 'metadata' || item == 'created' || item == 'modified' ||
            item == 'type' || item == 'activatted' ) { continue; }
        data[item] = entityData[item];
      }

      this.setAllQueryParams(method, path, data, null,
        function(response) {
          try {
            var entity = response.entities[0];
            self.set(entity);
            if (typeof(successCallback) === "function"){
              successCallback(response);
            }
          } catch (e) {
            if (typeof(errorCallback) === "function"){
              errorCallback(response);
            }
          }
        },
        function(response) {
          if (typeof(errorCallback) === "function"){
            errorCallback(response);
          }
        }
      );
      baasio.ApiClient.runAppQuery(this);
    },

    /**
     *  refreshes the entity by making a GET call back to the database
     *
     *  @method fetch
     *  @public
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    fetch: function (successCallback, errorCallback){
      var path = this.getCollectionType();
      //if a uuid is available, use that, otherwise, use the name
      if (this.isUUID(this.get('uuid'))) {
        path += "/" + this.get('uuid');
      } else {
        if (path == "users") {
          if (this.get("username")) {
            path += "/" + this.get("username");
          } else {
            console.log('no username specified');
            if (typeof(errorCallback) === "function"){
              console.log('no username specified');
            }
          }
        } else {
          if (this.get()) {
            path += "/" + this.get();
          } else {
            console.log('no entity identifier specified');
            if (typeof(errorCallback) === "function"){
              console.log('no entity identifier specified');
            }
          }
        }
      }
      var self = this;
      this.setAllQueryParams('GET', path, null, null,
        function(response) {
          if (response.user) {
            self.set(response.user);
          } else if (response.entities[0]){
            self.set(response.entities[0]);
          }
          if (typeof(successCallback) === "function"){
            successCallback(response);
          }
        },
        function(response) {
          if (typeof(errorCallback) === "function"){
              errorCallback(response);
          }
        }
      );
      baasio.ApiClient.runAppQuery(this);
    },

    /**
     *  deletes the entity from the database - will only delete
     *  if the object has a valid uuid
     *
     *  @method destroy
     *  @public
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     *
     */
    destroy: function (successCallback, errorCallback){
      var path = this.getCollectionType();
      if (this.isUUID(this.get('uuid'))) {
        path += "/" + this.get('uuid');
      } else {
        console.log('Error trying to delete object - no uuid specified.');
        if (typeof(errorCallback) === "function"){
          errorCallback('Error trying to delete object - no uuid specified.');
        }
      }
      var self = this;
      this.setAllQueryParams('DELETE', path, null, null,
        function(response) {
          //clear out this object
          self.set(null);
          if (typeof(successCallback) === "function"){
            successCallback(response);
          }
        },
        function(response) {
          if (typeof(errorCallback) === "function"){
              errorCallback(response);
          }
        }
      );
      baasio.ApiClient.runAppQuery(this);
    }

  });


})(baasio);