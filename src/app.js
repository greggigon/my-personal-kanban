function Kanban(name, numberOfColumns) {
	this.name = name;
	this.numberOfColumns = numberOfColumns;
	this.columns = [];
	return this;
}

function KanbanColumn(name){
	this.name = name;
	this.cards = [];
	return this;
}

function KanbanCard(name){
	this.name = name;
	return this;
}

function KanbanRepository(){
	return {
		kanbansByName : {},
		
		add: function(kanban){
			this.kanbansByName[kanban.name] = kanban;
			return kanban;
		},

		all: function(){
			return this.kanbansByName;
		},

		remove: function(kanbanName) {
			if (this.kanbansByName[kanbanName]){
				delete this.kanbansByName[kanbanName];
			}
		},

		save: function(){
			
		},

		load: function(){
			
		}
	}
};


var mpkService = angular.module('mpk.service', []);
mpkService.factory('kanbanRepository', KanbanRepository);

var mpk = angular.module('mpk', ['mpk.service']);

function MenuController($scope){
	$scope.newKanbanAction = function(){
		return false;
	}
}

function NewKanbanController($scope, kanbanRepository){
	$scope.numberOfColumns = 3;
	$scope.kanbanName = '';

	$scope.createNew = function(dialogId){
		var newKanban = new Kanban($scope.kanbanName, $scope.numberOfColumns);
		kanbanRepository.add(newKanban);
		$(dialogId).modal('toggle');
		$scope.kanbanName = '';
		$scope.numberOfColumns = 3;
		return true;
	}
}

function KanbanController($scope) {

}

function ApplicationController($scope){
	var kanban = new Kanban('Test kanban', 3);

	kanban.columns.push(new KanbanColumn('Column 1'));
	kanban.columns.push(new KanbanColumn('Column 2'));
	kanban.columns.push(new KanbanColumn('Column 3'));

	$scope.kanban = kanban;
}