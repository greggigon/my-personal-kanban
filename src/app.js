function Kanban(name, numberOfColumns) {
	this.name = name;
	this.numberOfColumns = numberOfColumns;
	this.columns = {};
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