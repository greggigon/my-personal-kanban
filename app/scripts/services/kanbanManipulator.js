'use strict';

angular.module('mpk').factory('kanbanManipulator', function () {
  return {
    addColumn: function(kanban, columnName){
      kanban.columns.push(new KanbanColumn(columnName));
    },

    addCardToColumn: function(kanban, column, cardTitle, details, color){
      angular.forEach(kanban.columns, function(col){
        if (col.name === column.name){
          col.cards.push(new KanbanCard(cardTitle, details, color));
        }
      });
    },
    removeCardFromColumn: function(kanban, column, card){
      angular.forEach(kanban.columns, function(col){
        if (col.name === column.name){
          col.cards.splice(col.cards.indexOf(card), 1);
        }
      });
    }
  };
});
