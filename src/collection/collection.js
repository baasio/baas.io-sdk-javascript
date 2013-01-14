/**
 *  The Collection class models baasio Collections.  It essentially
 *  acts as a container for holding Entity objects, while providing
 *  additional funcitonality such as paging, and saving
 *
 *  @class Collection
 *  @author Rod Simpson (rod@apigee.com)
 */
(function (baasio) {
  /**
   *  Collection is a container class for holding entities
   *
   *  @constructor
   *  @param {string} collectionPath - the type of collection to model
   *  @param {uuid} uuid - (optional), the UUID of the collection if it is known
   */
  baasio.Collection = function(path, uuid) {
    this._path = path;
    this._uuid = uuid;
    this._list = [];
    this._Query = new baasio.Query();
    this._iterator = -1; //first thing we do is increment, so set to -1
  };

  baasio.Collection.prototype = new baasio.Query();

  _.extend(baasio.Collection.prototype, {
    /**
     *  gets the current Collection path
     *
     *  @method getPath
     *  @return {string} path
     */
    getPath: function (){
      return this._path;
    },

    setPath: function (path){
      this._path = path;
    },
    getUUID: function (){
      return this._uuid;
    },

    /**
     *  sets the current Collection UUID
     *  @method setUUID
     *  @param {string} uuid
     *  @return none
     */
    setUUID: function (uuid){
      this._uuid = uuid;
    },

    /**
     *  Adds an Entity to the collection (adds to the local object)
     *
     *  @method addEntity
     *  @param {object} entity
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    addEntity: function (entity){
      //then add it to the list
      var count = this._list.length;
      this._list[count] = entity;
    },

    /**
     *  Adds a new Entity to the collection (saves, then adds to the local object)
     *
     *  @method addNewEntity
     *  @param {object} entity
     *  @return none
     */
    addNewEntity: function (entity, successCallback, errorCallback) {
      //add the entity to the list
      this.addEntity(entity);
      //then save the entity
      entity.save(successCallback, errorCallback);
    },

    destroyEntity: function (entity) {
      //first get the entities uuid
      var uuid = entity.get('uuid');
      //if the entity has a uuid, delete it
      if (uuid) {
        //then remove it from the list
        var count = this._list.length;
        var i=0;
        var reorder = false;
        for (i=0; i<count; i++) {
          if(reorder) {
            this._list[i-1] = this._list[i];
            this._list[i] = null;
          }
          if (this._list[i].get('uuid') == uuid) {
            this._list[i] = null;
            reorder=true;
          }
        }
      }
      //first destroy the entity on the server
      entity.destroy();
    },

    /**
     *  Looks up an Entity by a specific field - will return the first Entity that
     *  has a matching field
     *
     *  @method getEntityByField
     *  @param {string} field
     *  @param {string} value
     *  @return {object} returns an entity object, or null if it is not found
     */
    getEntityByField: function (field, value){
      var count = this._list.length;
      var i=0;
      for (i=0; i<count; i++) {
        if (this._list[i].getField(field) == value) {
          return this._list[i];
        }
      }
      return null;
    },

    /**
     *  Looks up an Entity by UUID
     *
     *  @method getEntityByUUID
     *  @param {string} UUID
     *  @return {object} returns an entity object, or null if it is not found
     */
    getEntityByUUID: function (UUID){
      var count = this._list.length;
      var i=0;
      for (i=0; i<count; i++) {
        if (this._list[i].get('uuid') == UUID) {
          return this._list[i];
        }
      }
      return null;
    },

    /**
     *  Returns the first Entity of the Entity list - does not affect the iterator
     *
     *  @method getFirstEntity
     *  @return {object} returns an entity object
     */
    getFirstEntity: function (){
      var count = this._list.length;
        if (count > 0) {
          return this._list[0];
        }
        return null;
    },

    /**
     *  Returns the last Entity of the Entity list - does not affect the iterator
     *
     *  @method getLastEntity
     *  @return {object} returns an entity object
     */
    getLastEntity: function (){
      var count = this._list.length;
        if (count > 0) {
          return this._list[count-1];
        }
        return null;
    },

    /**
     *  Entity iteration -Checks to see if there is a "next" entity
     *  in the list.  The first time this method is called on an entity
     *  list, or after the resetEntityPointer method is called, it will
     *  return true referencing the first entity in the list
     *
     *  @method hasNextEntity
     *  @return {boolean} true if there is a next entity, false if not
     */
    hasNextEntity: function (){
      var next = this._iterator + 1;
        if(next >=0 && next < this._list.length) {
          return true;
        }
        return false;
    },

    /**
     *  Entity iteration - Gets the "next" entity in the list.  The first
     *  time this method is called on an entity list, or after the method
     *  resetEntityPointer is called, it will return the,
     *  first entity in the list
     *
     *  @method hasNextEntity
     *  @return {object} entity
     */
    getNextEntity: function (){
      this._iterator++;
        if(this._iterator >= 0 && this._iterator <= this._list.length) {
          return this._list[this._iterator];
        }
        return false;
    },

    /**
     *  Entity iteration - Checks to see if there is a "previous"
     *  entity in the list.
     *
     *  @method hasPreviousEntity
     *  @return {boolean} true if there is a previous entity, false if not
     */
    hasPreviousEntity: function (){
      var previous = this._iterator - 1;
        if(previous >=0 && previous < this._list.length) {
          return true;
        }
        return false;
    },

    /**
     *  Entity iteration - Gets the "previous" entity in the list.
     *
     *  @method getPreviousEntity
     *  @return {object} entity
     */
    getPreviousEntity: function (){
       this._iterator--;
        if(this._iterator >= 0 && this._iterator <= this._list.length) {
          return this.list[this._iterator];
        }
        return false;
    },

    /**
     *  Entity iteration - Resets the iterator back to the beginning
     *  of the list
     *
     *  @method resetEntityPointer
     *  @return none
     */
    resetEntityPointer: function (){
       this._iterator  = -1;
    },

    /**
     *  gets and array of all entities currently in the colleciton object
     *
     *  @method getEntityList
     *  @return {array} returns an array of entity objects
     */
    getEntityList: function (){
       return this._list;
    },

    /**
     *  sets the entity list
     *
     *  @method setEntityList
     *  @param {array} list - an array of Entity objects
     *  @return none
     */
    setEntityLis: function (list){
      this._list = list;
    }, 

    /**
     *  Paging -  checks to see if there is a next page od data
     *
     *  @method hasNextPage
     *  @return {boolean} returns true if there is a next page of data, false otherwise
     */
    hasNextPage: function (){
      return this.hasNext();
    },

    /**
     *  Paging - advances the cursor and gets the next
     *  page of data from the API.  Stores returned entities
     *  in the Entity list.
     *
     *  @method getNextPage
     *  @return none
     */
    getNextPage: function (){
      if (this.hasNext()) {
          //set the cursor to the next page of data
          this.getNext();
          //empty the list
          this.setEntityList([]);
          baasio.ApiClient.runAppQuery(this);
        }
    },

    /**
     *  Paging -  checks to see if there is a previous page od data
     *
     *  @method hasPreviousPage
     *  @return {boolean} returns true if there is a previous page of data, false otherwise
     */
    hasPreviousPage: function (){
      return this.hasPrevious();
    },

    /**
     *  Paging - reverts the cursor and gets the previous
     *  page of data from the API.  Stores returned entities
     *  in the Entity list.
     *
     *  @method getPreviousPage
     *  @return none
     */
    getPreviousPage: function (){
      if (this.hasPrevious()) {
          this.getPrevious();
          //empty the list
          this.setEntityList([]);
          baasio.ApiClient.runAppQuery(this);
        }
    },

    /**
     *  clears the query parameters object
     *
     *  @method clearQuery
     *  @return none
     */
    clearQuery: function (){
      this.clearAll();
    },


    /**
     *  A method to get all items in the collection, as dictated by the
     *  cursor and the query.  By default, the API returns 10 items in
     *  a given call.  This can be overriden so that more or fewer items
     *  are returned.  The entities returned are all stored in the colleciton
     *  object's entity list, and can be retrieved by calling getEntityList()
     *
     *  @method get
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    fetch: function (successCallback, errorCallback){
      var self = this;
      var queryParams = this.getQueryParams();
      //empty the list
      this.setEntityList([]);
      this.setAllQueryParams('GET', this.getPath(), null, queryParams,
        function(response) {
          if (response.entities) {
            this.resetEntityPointer();
            var count = response.entities.length;
            for (var i=0;i<count;i++) {
              var uuid = response.entities[i].uuid;
              if (uuid) {
                var entity = new baasio.Entity(self.getPath(), uuid);
                //store the data in the entity
                var data = response.entities[i] || {};
                delete data.uuid; //remove uuid from the object
                entity.set(data);
                //store the new entity in this collection
                self.addEntity(entity);
              }
            }
            if (typeof(successCallback) === "function"){
              successCallback(response);
            }
          } else {
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
     *  A method to save all items currently stored in the collection object
     *  caveat with this method: we can't update anything except the items
     *  currently stored in the collection.
     *
     *  @method save
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    save: function (successCallback, errorCallback){
      //loop across all entities and save each one
      var entities = this.getEntityList();
      var count = entities.length;
      var jsonObj = [];
      for (var i=0;i<count;i++) {
        entity = entities[i];
        data = entity.get();
        if (entity.get('uuid')) {
          data.uuid = entity.get('uuid');
          jsonObj.push(data);
        }
        entity.save();
      }
      this.setAllQueryParams('PUT', this.getPath(), jsonObj, null,successCallback, errorCallback);
      baasio.ApiClient.runAppQuery(this);
    }

  });

})(baasio);