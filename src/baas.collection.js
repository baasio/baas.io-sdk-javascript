// Parse.Query is a way to create a list of Parse.Objects.
(function(root) {
  root.Baas = root.Baas || {};
  var Baas = root.Baas;

  /**
   *  Collection is a container class for holding entities
   *
   *  @class Collection
   */
  Baas.Collection = function(name, uuid) {
    this._name = name;
    this._uuid = uuid;
    this._list = [];
  };

  Baas.Collection.prototype = {
    getName: function() {
      return this._name;
    },
    setName: function(name) {
      this._name = name;
    },
    getUUID: function() {
      return this._uuid;
    },
    setUUID: function(uuid) {
      this._uuid = uuid;
    },
    setCurrentOrganization: function(org) {
      this._name = org.getName();
      this._uuid = org.getUUID();
      this._list = org.getList();
    },
    addItem: function(item) {
      var count = this._list.length;
      this._list[count] = item;
    },
    getItemByName: function(name) {
      var count = this._list.length;
      var i=0;
      for (i=0; i<count; i++) {
        if (this._list[i].getName() == name) {
          return this._list[i];
        }
      }
      return null;
    },
    getItemByUUID: function(UUID) {
      var count = this._list.length;
      var i=0;
      for (i=0; i<count; i++) {
        if (this._list[i].getUUID() == UUID) {
          return this._list[i];
        }
      }
      return null;
    },
    getFirstItem: function() {
      var count = this._list.length;
      if (count > 0) {
        return this._list[0];
      }
      return null;
    },
    getList: function() {
      return this._list;
    },
    setList: function(list) {
      this._list = list;
    },
    clearList: function() {
      this._list = [];
    }
  };

}(this));