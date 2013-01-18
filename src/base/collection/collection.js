
/*
*  The Collection class models Baas Collections.  It essentially
*  acts as a container for holding Entity objects, while providing
*  additional funcitonality such as paging, and saving
*
*  @constructor
*  @param {string} options - configuration object
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.Collection = function(options, callback) {
  this._client = options.client;
  this._type = options.type;
  this.qs = options.qs || {};

  //iteration
  this._list = [];
  this._iterator = -1; //first thing we do is increment, so set to -1

  //paging
  this._previous = [];
  this._next = null;
  this._cursor = null

  //populate the collection
  this.fetch(callback);
}

/*
*  Populates the collection from the server
*
*  @method fetch
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.Collection.prototype.fetch = function (callback) {
  var self = this;
  var qs = this.qs;

  //add in the cursor if one is available
  if (this._cursor) {
    qs.cursor = this._cursor;
  } else {
    delete qs.cursor;
  }
  var options = {
    method:'GET',
    endpoint:this._type,
    qs:this.qs
  };
  this._client.request(options, function (err, data) {
    if(err && self._client.logging) {
     console.log('error getting collection');
    } else {
      //save the cursor if there is one
      var cursor = data.cursor || null;
      self.saveCursor(cursor);
      if (data.entities) {
        self.resetEntityPointer();
        var count = data.entities.length;
        //save entities locally
        self._list = []; //clear the local list first
        for (var i=0; i < count; i++) {
          var uuid = data.entities[i].uuid;
          if (uuid) {
            var entityData = data.entities[i] || {};
            var entityOptions = {
              type:self._type,
              client:self._client,
              uuid:uuid,
              data:entityData
            };
            var ent = new Baas.Entity(entityOptions);
            var ct = self._list.length;
            self._list[ct] = ent;
          }
        }
      }
    }
    if (typeof(callback) === 'function') {
      callback(err, data);
    }
  });
}

/*
*  Adds a new Entity to the collection (saves, then adds to the local object)
*
*  @method addNewEntity
*  @param {object} entity
*  @param {function} callback
*  @return {callback} callback(err, data, entity)
*/
Baas.Collection.prototype.addEntity = function (options, callback) {
  var self = this;
  options.type = this._type;

  //create the new entity
  this._client.createEntity(options, function (err, entity) {
    if (!err) {
      //then add the entity to the list
      var count = self._list.length;
      self._list[count] = entity;
    }
    if (typeof(callback) === 'function') {
      callback(err, entity);
    }
  });
}

/*
*  Removes the Entity from the collection, then destroys the object on the server
*
*  @method destroyEntity
*  @param {object} entity
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.Collection.prototype.destroyEntity = function (entity, callback) {
  var self = this;
  entity.destroy(function(err, data) {
    if (err) {
      if (self._client.logging) {
        console.log('could not destroy entity');
      }
      if (typeof(callback) === 'function') {
        callback(err, data);
      }
    } else {
      //destroy was good, so repopulate the collection
      self.fetch(callback);
    }
  });
}

/*
*  Looks up an Entity by UUID
*
*  @method getEntityByUUID
*  @param {string} UUID
*  @param {function} callback
*  @return {callback} callback(err, data, entity)
*/
Baas.Collection.prototype.getEntityByUUID = function (uuid, callback) {
  //get the entity from the database
  var options = {
    data: {
      type: this._type,
      uuid:uuid
    },
    client: this._client
  }
  var entity = new Baas.Entity(options);
  entity.fetch(callback);
}

/*
*  Returns the first Entity of the Entity list - does not affect the iterator
*
*  @method getFirstEntity
*  @return {object} returns an entity object
*/
Baas.Collection.prototype.getFirstEntity = function () {
  var count = this._list.length;
  if (count > 0) {
    return this._list[0];
  }
  return null;
}

/*
*  Returns the last Entity of the Entity list - does not affect the iterator
*
*  @method getLastEntity
*  @return {object} returns an entity object
*/
Baas.Collection.prototype.getLastEntity = function () {
  var count = this._list.length;
  if (count > 0) {
    return this._list[count-1];
  }
  return null;
}

/*
*  Entity iteration -Checks to see if there is a "next" entity
*  in the list.  The first time this method is called on an entity
*  list, or after the resetEntityPointer method is called, it will
*  return true referencing the first entity in the list
*
*  @method hasNextEntity
*  @return {boolean} true if there is a next entity, false if not
*/
Baas.Collection.prototype.hasNextEntity = function () {
  var next = this._iterator + 1;
  var hasNextElement = (next >=0 && next < this._list.length);
  if(hasNextElement) {
    return true;
  }
  return false;
}

/*
*  Entity iteration - Gets the "next" entity in the list.  The first
*  time this method is called on an entity list, or after the method
*  resetEntityPointer is called, it will return the,
*  first entity in the list
*
*  @method hasNextEntity
*  @return {object} entity
*/
Baas.Collection.prototype.getNextEntity = function () {
  this._iterator++;
  var hasNextElement = (this._iterator >= 0 && this._iterator <= this._list.length);
  if(hasNextElement) {
    return this._list[this._iterator];
  }
  return false;
}

/*
*  Entity iteration - Checks to see if there is a "previous"
*  entity in the list.
*
*  @method hasPrevEntity
*  @return {boolean} true if there is a previous entity, false if not
*/
Baas.Collection.prototype.hasPrevEntity = function () {
  var previous = this._iterator - 1;
  var hasPreviousElement = (previous >=0 && previous < this._list.length);
  if(hasPreviousElement) {
    return true;
  }
  return false;
}

/*
*  Entity iteration - Gets the "previous" entity in the list.
*
*  @method getPrevEntity
*  @return {object} entity
*/
Baas.Collection.prototype.getPrevEntity = function () {
   this._iterator--;
   var hasPreviousElement = (this._iterator >= 0 && this._iterator <= this._list.length);
   if(hasPreviousElement) {
    return this.list[this._iterator];
   }
   return false;
}

/*
*  Entity iteration - Resets the iterator back to the beginning
*  of the list
*
*  @method resetEntityPointer
*  @return none
*/
Baas.Collection.prototype.resetEntityPointer = function () {
   this._iterator  = -1;
}

/*
* Method to save off the cursor just returned by the last API call
*
* @public
* @method saveCursor
* @return none
*/
Baas.Collection.prototype.saveCursor = function(cursor) {
  //if current cursor is different, grab it for next cursor
  if (this._next !== cursor) {
    this._next = cursor;
  }
}

/*
* Resets the paging pointer (back to original page)
*
* @public
* @method resetPaging
* @return none
*/
Baas.Collection.prototype.resetPaging = function() {
  this._previous = [];
  this._next = null;
  this._cursor = null;
}

/*
*  Paging -  checks to see if there is a next page od data
*
*  @method hasNextPage
*  @return {boolean} returns true if there is a next page of data, false otherwise
*/
Baas.Collection.prototype.hasNextPage = function () {
  return (this._next);
}

/*
*  Paging - advances the cursor and gets the next
*  page of data from the API.  Stores returned entities
*  in the Entity list.
*
*  @method getNextPage
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.Collection.prototype.getNextPage = function (callback) {
  if (this.hasNextPage()) {
    //set the cursor to the next page of data
    this._previous.push(this._cursor);
    this._cursor = this._next;
    //empty the list
    this._list = [];
    this.fetch(callback);
  }
}

/*
*  Paging -  checks to see if there is a previous page od data
*
*  @method hasPreviousPage
*  @return {boolean} returns true if there is a previous page of data, false otherwise
*/
Baas.Collection.prototype.hasPreviousPage = function () {
  return (this._previous.length > 0);
}

/*
*  Paging - reverts the cursor and gets the previous
*  page of data from the API.  Stores returned entities
*  in the Entity list.
*
*  @method getPreviousPage
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.Collection.prototype.getPreviousPage = function (callback) {
  if (this.hasPreviousPage()) {
    this._next=null; //clear out next so the comparison will find the next item
    this._cursor = this._previous.pop();
    //empty the list
    this._list = [];
    this.fetch(callback);
  }
}