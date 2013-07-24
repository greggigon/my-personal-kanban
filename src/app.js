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
		},
		moveCardFromColumnToColumn: function(kanban, leftColumn, rightColumn, cardIndex){
			if (leftColumn == undefined || rightColumn == undefined) return;
			if (leftColumn == rightColumn) return;
			var left = kanban.columns[leftColumn];
			var right = kanban.columns[rightColumn];
			var card = left.cards.splice(cardIndex, 1)[0];
			right.cards.push(card);
			return card;
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

mpk.directive('sortable', function(){
	return {
		restrict: 'A',
		require: "?ngModel",
		link: function(scope, element, attrs, ngModel){
			if (ngModel){
				ngModel.$render = function(){
					element.sortable( 'refresh' );	
				}
			};

			element.sortable({
				connectWith: attrs.sortableSelector,
				revert: true, 
				remove: function(e, ui){
					if (ngModel.$modelValue.length === 1) {
                  		ui.item.sortable.moved = ngModel.$modelValue.splice(0, 1)[0];
                	} else {
                  		ui.item.sortable.moved =  ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0];
                	}
				},
				receive: function(e, ui){
					ui.item.sortable.relocate = true;
					ngModel.$modelValue.splice(ui.item.index(), 0, ui.item.sortable.moved);
				},
				update: function(e, ui){
					ui.item.sortable.resort = ngModel;
				},
				start: function(e, ui){
					ui.item.sortable = { index: ui.item.index(), resort: ngModel };
				},
				stop: function(e, ui){
					if (ui.item.sortable.resort && !ui.item.sortable.relocate){
						var end, start;
	                	start = ui.item.sortable.index;
	                	end = ui.item.index();

	                	ui.item.sortable.resort.$modelValue.splice(end, 0, ui.item.sortable.resort.$modelValue.splice(start, 1)[0]);
	                }
	                if (ui.item.sortable.resort || ui.item.sortable.relocate) {
	                	scope.$apply();
	                }
				}
			});
		}
	};
});


function MenuController($scope, kanbanRepository){
	$scope.save = function(){
		return kanbanRepository.save();
	};

	$scope.delete = function(){
		if (confirm('You sure you want to delete the entire Kanban?')){
			kanbanRepository.remove($scope.kanban.name);
			var all = kanbanRepository.all();
			if (all.length > 0){
				kanbanRepository.setLastUsed(all[0].name);
			} else {
				kanbanRepository.setLastUsed(undefined);
			}
			$scope.$emit('KanbanDeleted');
		}
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

function OpenKanbanController($scope){
	$scope.open = function(){
		$scope.$emit('Open', {kanbanName: $scope.selectedToOpen})
	};
};

function ApplicationController($scope, $window, kanbanRepository, kanbanManipulator){

	var resizeTheColumns = function(elementName){
		var windowHeight = angular.element($window).height();
		angular.forEach(angular.element(elementName), function(e){
			angular.element(e).attr('style', 'min-height:'+(windowHeight-180)+'px;');
		});
	};

	$scope.$on('ChangeCurrentKanban', function(){
		$scope.kanban = kanbanRepository.getLastUsed();
		$scope.allKanbans = Object.keys(kanbanRepository.all());
	});

	$scope.$on('NewCardRequest', function(event, arguments){
		kanbanManipulator.addCardToColumn($scope.kanban, arguments.column, arguments.title);
	});

	$scope.$on('Open', function(event, arguments){
		$scope.kanban = kanbanRepository.get(arguments.kanbanName);

		kanbanRepository.setLastUsed(arguments.kanbanName);
		kanbanRepository.save();

		resizeTheColumns('ul.cards');
	});

	$scope.$on('KanbanDeleted', function(){
		$scope.kanban = undefined;
		$scope.allKanbans = Object.keys(kanbanRepository.all());
	});

	var currentKanban = new Kanban('Kanban name', 0);
	var loadedRepo = kanbanRepository.load();

	if (loadedRepo) {
		currentKanban = kanbanRepository.getLastUsed(); 
	} 

	$scope.kanban = currentKanban;
	$scope.allKanbans = Object.keys(kanbanRepository.all());
	$scope.selectedToOpen = currentKanban.name;

	$scope.$watch('kanban', function(newValue, oldValue){
		kanbanRepository.save();
	}, true);

	// Do stuff when the entire document gets loaded
	angular.element(document).ready(function(){
		resizeTheColumns('ul.cards');
	});
}