function Kanban(name, numberOfColumns) {
	return {
		name: name,
		numberOfColumns: numberOfColumns,
		columns: []
	};
}

function KanbanColumn(name){
	return {
		name: name,
		cards: []
	}
}

function KanbanCard(name){
	this.name = name;
	return this;
}

function KanbanManipulator(){
	return {
		addColumn: function(kanban, columnName){
			kanban.columns.push(new KanbanColumn(columnName));
		},

		addCardToColumn: function(kanban, column, cardTitle){
			angular.forEach(kanban.columns, function(col){
				if (col.name == column.name){
					col.cards.push(new KanbanCard(cardTitle));
				}
			});
		}
	};
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
mpkService.factory('kanbanManipulator', KanbanManipulator);

var mpk = angular.module('mpk', ['mpk.service']);

function MenuController($scope, kanbanRepository){
	$scope.newKanbanAction = function(){
		return false;
	};
	$scope.save = function(){
		return kanbanRepository.save();
	};
}

function NewKanbanController($scope, kanbanRepository, kanbanManipulator){
	$scope.numberOfColumns = 3;
	$scope.kanbanName = '';

	$scope.createNew = function(dialogId){
		var newKanban = new Kanban($scope.kanbanName, $scope.numberOfColumns);
		for (i=1;i < parseInt($scope.numberOfColumns) + 1 ; i++){
			kanbanManipulator.addColumn(newKanban, 'Column '+i);
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
	$scope.column = null;
	$scope.title = '';

	$scope.$on('AddNewCard', function(theEvent, args){
		$scope.kanbanColumnName = args.column.name;
		$scope.column = args.column;
	});

	$scope.addNewCard = function(){
		$scope.$emit('NewCardRequest', {title: $scope.title, column: $scope.column});
		$scope.title = '';
	};
}

function KanbanController($scope) {
	$scope.addNewCard = function(column){
		$scope.$broadcast('AddNewCard', {column: column});
	};
}

function ApplicationController($scope, kanbanRepository, kanbanManipulator){

	$scope.$on('ChangeCurrentKanban', function(){
		$scope.kanban = kanbanRepository.getLastUsed();
	});

	$scope.$on('NewCardRequest', function(event, arguments){
		kanbanManipulator.addCardToColumn($scope.kanban, arguments.column, arguments.title);
	});

	var currentKanban = new Kanban('Kanban name', 0);
	var loadedRepo = kanbanRepository.load();

	if (loadedRepo) {
		currentKanban = kanbanRepository.getLastUsed(); 
	} 

	$scope.kanban = currentKanban;
}