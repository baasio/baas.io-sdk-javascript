
/*
*  A class to Model a Baas Entity.
*  Set the type of entity in the 'data' json object
*
*  @constructor
*  @param {object} options {client:client, data:{'type':'collection_type', 'key':'value'}, uuid:uuid}}
*/
Baas.Entity = function(options) {
  this._client = options.client;
  this._data = options.data || {};
};

/*
*  gets a specific field or the entire data object. If null or no argument
*  passed, will return all data, else, will return a specific field
*
*  @method get
*  @param {string} field
*  @return {string} || {object} data
*/
Baas.Entity.prototype.get = function (field) {
  if (field) {
    return this._data[field];
  } else {
    return this._data;
  }
}

/*
*  adds a specific key value pair or object to the Entity's data
*  is additive - will not overwrite existing values unless they
*  are explicitly specified
*
*  @method set
*  @param {string} key || {object}
*  @param {string} value
*  @return none
*/
Baas.Entity.prototype.set = function (key, value) {
  if (typeof key === 'object') {
    for(var field in key) {
      this._data[field] = key[field];
    }
  } else if (typeof key === 'string') {
    if (value === null) {
      delete this._data[key];
    } else {
      this._data[key] = value;
    }
  } else {
    this._data = null;
  }
}

/*
*  Saves the entity back to the database
*
*  @method save
*  @public
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.Entity.prototype.save = function (callback) {
  //TODO:  API will be changed soon to accomodate PUTs via name which create new entities
  //       This function should be changed to PUT only at that time, and updated to use
  //       either uuid or name
  var type = this.get('type');
  var method = 'POST';
  if (isUUID(this.get('uuid'))) {
    method = 'PUT';
    type += '/' + this.get('uuid');
  }

  //update the entity
  var self = this;
  var data = {};
  var entityData = this.get();
  //remove system specific properties
  for (var item in entityData) {
    if (item === 'metadata' || item === 'created' || item === 'modified' ||
        item === 'type' || item === 'activatted' ) { continue; }
    data[item] = entityData[item];
  }
  var options =  {
    method:method,
    endpoint:type,
    body:data
  };
  //save the entity first
  this._client.request(options, function (err, retdata) {
    if (err && self._client.logging) {
      console.log('could not save entity');
      if (typeof(callback) === 'function') {
        return callback(err, retdata, self);
      }
    } else {
      if (retdata.entities.length) {
        var entity = retdata.entities[0];
        self.set(entity);
      }
      //if this is a user, update the password if it has been specified;
      var needPasswordChange = (type === 'users' && entityData.oldpassword && entityData.newpassword);
      if (needPasswordChange) {
        //Note: we have a ticket in to change PUT calls to /users to accept the password change
        //      once that is done, we will remove this call and merge it all into one
        var pwdata = {};
        pwdata.oldpassword = entityData.oldpassword;
        pwdata.newpassword = entityData.newpassword;
        this._client.request(
          {
            method:'PUT',
            endpoint:type,
            body:pwdata
          },
          function (err, data) {
            if (err && self._client.logging) {
              console.log('could not update user');
            }
            //remove old and new password fields so they don't end up as part of the entity object
            self.set('oldpassword', null);
            self.set('newpassword', null);
            if (typeof(callback) === 'function') {
              callback(err, data, self);
            }
          }
        );
      } else if (typeof(callback) === 'function') {
        callback(err, retdata, self);
      }
    }
  });
}

/*
*  refreshes the entity by making a GET call back to the database
*
*  @method fetch
*  @public
*  @param {function} callback
*  @return {callback} callback(err, data)
*/
Baas.Entity.prototype.fetch = function (callback) {
  var type = this.get('type');
  var self = this;

  //if a uuid is available, use that, otherwise, use the name
  if (this.get('uuid')) {
    type += '/' + this.get('uuid');
  } else {
    if (type === 'users') {
      if (this.get('username')) {
        type += '/' + this.get('username');
      } else {
        if (typeof(callback) === 'function') {
          var error = 'cannot fetch entity, no username specified';
          if (self._client.logging) {
            console.log(error);
          }
          return callback(true, error, self)
        }
      }
    } else {
      if (this.get('name')) {
        type += '/' + this.get('name');
      } else {
        if (typeof(callback) === 'function') {
          var error = 'cannot fetch entity, no name specified';
          if (self._client.logging) {
            console.log(error);
          }
          return callback(true, error, self)
        }
      }
    }
  }
  var options = {
    method:'GET',
    endpoint:type
  };
  this._client.request(options, function (err, data) {
    if (err && self._client.logging) {
      console.log('could not get entity');
    } else {
      if (data.user) {
        self.set(data.user);
      } else if (data.entities.length) {
        var entity = data.entities[0];
        self.set(entity);
      }
    }
    if (typeof(callback) === 'function') {
      callback(err, data, self);
    }
  });
}

/*
*  deletes the entity from the database - will only delete
*  if the object has a valid uuid
*
*  @method destroy
*  @public
*  @param {function} callback
*  @return {callback} callback(err, data)
*
*/
Baas.Entity.prototype.destroy = function (callback) {
  var type = this.get('type');
  if (isUUID(this.get('uuid'))) {
    type += '/' + this.get('uuid');
  } else {
    if (typeof(callback) === 'function') {
      var error = 'Error trying to delete object - no uuid specified.';
      if (self._client.logging) {
        console.log(error);
      }
      callback(true, error);
    }
  }
  var self = this;
  var options = {
    method:'DELETE',
    endpoint:type
  };
  this._client.request(options, function (err, data) {
    if (err && self._client.logging) {
      console.log('entity could not be deleted');
    } else {
      self.set(null);
    }
    if (typeof(callback) === 'function') {
      callback(err, data);
    }
  });
}
