function Kanban(name, numberOfColumns) {
	return {
		name: name,
		numberOfColumns: numberOfColumns,
		columns: [],

		addColumn: function(columnName){
			this.columns.push(new KanbanColumn(columnName));
		}
	};
}

function KanbanColumn(name){
	return {
		name: name,
		cards: [],

		addCard : function(title){
			cards.push(new KanbanCard(title));
			return cards;
		}
	}
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
			localStorage.setItem('myPersonalKanban', angular.toJson({kanbans: this.kanbansByName, lastUsed: this.lastUsed}, false));
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
			if (!this.lastUsed){
				return this.kanbansByName[Object.keys(this.kanbansByName)[0]]
			}
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
		for (i=1;i < parseInt($scope.numberOfColumns) + 1 ; i++){
			newKanban.addColumn('Column '+i);
		}
		kanbanRepository.add(newKanban);
		$(dialogId).modal('toggle');

		$scope.kanbanName = '';
		$scope.numberOfColumns = 3;
		
		kanbanRepository.setLastUsed(newKanban.name);
		$scope.$emit('ChangeCurrentKanban');

		return true;
	}
}

function NewKanbanCardController($scope){
	$scope.kanbanColumnName = '';
	
	$scope.$on('AddNewCard', function(theEvent, args){
		$scope.kanbanColumnName = args.column.name;
	});
}

function KanbanController($scope) {
	$scope.addNewCard = function(column){
		$scope.$broadcast('AddNewCard', {column: column});
	};
}

function ApplicationController($scope, kanbanRepository){

	$scope.$on('ChangeCurrentKanban', function(){
		$scope.kanban = kanbanRepository.getLastUsed();
	});

	var currentKanban = new Kanban('Kanban name', 0);
	var loadedRepo = kanbanRepository.load();

	if (loadedRepo) {
		currentKanban = kanbanRepository.getLastUsed(); 
	} 

	$scope.kanban = currentKanban;
}