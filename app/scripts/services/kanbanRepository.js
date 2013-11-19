'use strict';

angular.module('mpk').factory('kanbanRepository', function (cloudService) {
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
      return angular.toJson({kanbans: this.kanbansByName, lastUsed: this.lastUsed, theme: this.theme, lastUpdated: this.lastUpdated}, false);
    },

    save: function(){
      localStorage.setItem('myPersonalKanban', this.prepareSerializedKanbans());
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

    download: function(){
      return cloudService.downloadKanban();
    },

    saveDownloadedKanban: function(kanban, lastUpdated){
      var fromCloud = angular.fromJson(kanban); 
      this.kanbansByName = fromCloud.kanbans;
      this.lastUsed = fromCloud.lastUsed;
      this.theme = fromCloud.theme;
      this.lastUpdated = lastUpdated;
      this.save();
      
      return this; 
    }

  };
});
