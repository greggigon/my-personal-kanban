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
		lastUsed : '',
		
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
			return this.kanbansByName;
		},

		save: function(){
			localStorage.setItem('myPersonalKanban', angular.toJson({kanbans: this.kanbansByName, lastUsed: ''}, false));
			return this.kanbansByName;
		},

		load: function(){
			var saved = angular.fromJson(localStorage.getItem('myPersonalKanban'));
			if (saved == null) return null;
			this.kanbansByName = saved.kanbans;
			this.lastUsed = saved.lastUsed;
			return this.kanbansByName;
		},

		getLastUsed: function(){
			return this.kanbansByName[this.lastUsed];
		}, 

		setLastUsed : function(kanbanName){
			this.lastUsed = kanbanName;
			return this.lastUsed;
		}
	}
};


var mpkService = angular.module('mpk.service', []);
mpkService.factory('kanbanRepository', KanbanRepository);

var mpk = angular.module('mpk', ['mpk.service']);

function MenuController($scope, kanbanRepository){
	$scope.newKanbanAction = function(){
		return false;
	};
	$scope.save = function(){
		return kanbanRepository.save();
	};
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

function ApplicationController($scope, kanbanRepository){
	var loadedRepo = kanbanRepository.load();
	if (loadedRepo) {
		$scope.kanban = kanbanRepository.getLastUsed(); 
	} else {
		$scope.kanban = new Kanban('Kanban name', 0);
	}
}