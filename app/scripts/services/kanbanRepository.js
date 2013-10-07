'use strict';

angular.module('mpk').factory('kanbanRepository', function () {
  return {
    kanbansByName : {},
    lastUsed : '',
    theme: 'default-bright',
    
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

    save: function(){
      localStorage.setItem('myPersonalKanban', angular.toJson({kanbans: this.kanbansByName, lastUsed: this.lastUsed, theme: this.theme}, false));
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
    }
  };
});
