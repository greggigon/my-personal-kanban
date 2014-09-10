'use strict';

angular.module('mpk').factory('kanbanRepository', function (cloudService, cryptoService) {
  return {
    kanbansByName : {},
    lastUsed : '',
    theme: 'default-bright',
    lastUpdated: 0,
    
    add: function(kanban){
      this.kanbansByName[kanban.name] = kanban;
      this.save();
      return kanban;
    },

    all: function(){
      return this.kanbansByName;
    },

    get: function(kanbanName){
      return this.kanbansByName[kanbanName];
    },

    remove: function(kanbanName) {
      if (this.kanbansByName[kanbanName]){
        delete this.kanbansByName[kanbanName];
      }
      return this.kanbansByName;
    },

    prepareSerializedKanbans: function(){
      var toBeSerialized = {kanbans: this.kanbansByName, lastUsed: this.lastUsed, theme: this.theme, lastUpdated: this.lastUpdated};
      return angular.toJson(toBeSerialized, false);
    },

    save: function(){
      var prepared = this.prepareSerializedKanbans();
      localStorage.setItem('myPersonalKanban', prepared);
      return this.kanbansByName;
    },

    load: function(){
      var saved = angular.fromJson(localStorage.getItem('myPersonalKanban'));
      if (saved === null) {
        return null;
      }
      this.kanbansByName = saved.kanbans;
      this.lastUsed = saved.lastUsed;
      this.theme = saved.theme;
      this.lastUpdated = saved.lastUpdated;
      return this.kanbansByName;
    },

    getLastUsed: function(){
      if (!this.lastUsed){
        return this.kanbansByName[Object.keys(this.kanbansByName)[0]];
      }
      return this.kanbansByName[this.lastUsed];
    },

    setLastUsed : function(kanbanName){
      this.lastUsed = kanbanName;
      return this.lastUsed;
    },

    getTheme: function(){
      return this.theme;
    },

    setTheme: function(theme){
      this.theme = theme;
      this.save();
      return this.theme;
    },

    /**
    * returns the Promise from the chained calls (just in case I freaking forget)
    */
    upload: function(){
      return cloudService.uploadKanban(this.prepareSerializedKanbans());
    },

    setLastUpdated: function(updated){
      this.lastUpdated = updated;
      return this;
    },

    getLastUpdated: function(){
      return this.lastUpdated;
    },

    download: function(){
      return cloudService.downloadKanban();
    },

    saveDownloadedKanban: function(kanban, lastUpdated){
      if (typeof(kanban) == 'string'){
        try {
          kanban = cryptoService.decrypt(kanban, cloudService.settings.encryptionKey);
        }catch (ex){
          console.debug(ex);
          return {success: false, message: "Looks like Kanban saved in the cloud was persisted with different encryption key. You'll need to use old key to download your Kanban. Set it up in the Cloud Setup menu."};
        }
      }
      var fromCloud = angular.fromJson(kanban);
      this.kanbansByName = fromCloud.kanbans;
      this.lastUsed = fromCloud.lastUsed;
      this.theme = fromCloud.theme;
      this.lastUpdated = lastUpdated;
      this.save();

      return {success: true}; 
    },

    renameLastUsedTo: function(newName){
      var lastUsed = this.getLastUsed();
      delete this.kanbansByName[lastUsed.name];
      lastUsed.name = newName;

      this.kanbansByName[newName] = lastUsed;
      this.lastUsed = newName;
      return true;
    },

    import: function(kanbans){
      var self = this;
      angular.forEach(Object.keys(kanbans), function(kanbanName){
        self.kanbansByName[kanbanName] = kanbans[kanbanName];
      });
      var names = Object.keys(kanbans);
      this.setLastUsed(kanbans[names[0]]);
      this.save();
    }

  };
});
