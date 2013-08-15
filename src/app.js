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
		removeCardFromColumn: function(kanban, column, card){
			angular.forEach(kanban.columns, function(col){
				if (col.name == column.name){
					col.cards.splice(col.cards.indexOf(card), 1);
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

var mpk = angular.module('mpk', ['mpk.service', 'ui.bootstrap']);

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
	$scope.newKanban = function(){
		$scope.$emit('NewKanban');
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
	};

	$scope.closeNewKanban = function(){
		$scope.$emit('CloseNewKanban');
	};

}

function NewKanbanCardController($scope, kanbanManipulator){
	$scope.kanbanColumnName = '';
	$scope.column = null;
	$scope.title = '';
	$scope.newCardShouldBeOpen = false;


	$scope.$on('AddNewCard', function(theEvent, args){
		$scope.newCardShouldBeOpen = true;
		$scope.kanbanColumnName = args.column.name;
		$scope.column = args.column;
	});

	$scope.addNewCard = function(){
		// check if form is valid first, 
		$scope.$emit('NewCardRequest', {title: $scope.title, column: $scope.column});
		$scope.title = '';
		$scope.newCardShouldBeOpen = false;
	};

	$scope.close = function(){
		$scope.title = '';
		$scope.newCardShouldBeOpen = false;
	};
}

function KanbanController($scope) {
	$scope.addNewCard = function(column){
		$scope.$broadcast('AddNewCard', {column: column});
	};

	$scope.delete = function(card, column){
		if (confirm('You sure?')){
			$scope.$emit('DeleteCardRequest', {column: column, card: card});
		}	
	};
}

function OpenKanbanController($scope){
	$scope.open = function(){
		$scope.$emit('Open', {kanbanName: $scope.selectedToOpen})
	};
};

function ApplicationController($scope, $window, kanbanRepository, kanbanManipulator){
	$scope.newKanbanShouldBeOpen = false;

	$scope.$on('ChangeCurrentKanban', function(){
		$scope.kanban = kanbanRepository.getLastUsed();
		$scope.allKanbans = Object.keys(kanbanRepository.all());
		$scope.selectedToOpen = $scope.kanban.name;
	});

	$scope.$on('NewKanban', function(){
		$scope.newKanbanShouldBeOpen = true;
	});

	$scope.$on('CloseNewKanban', function(){
		$scope.newKanbanShouldBeOpen = false;
	});

	$scope.$on('NewCardRequest', function(event, arguments){
		kanbanManipulator.addCardToColumn($scope.kanban, arguments.column, arguments.title);
	});

	$scope.$on('DeleteCardRequest', function(event, arguments){
		kanbanManipulator.removeCardFromColumn($scope.kanban, arguments.column, arguments.card);
	});

	$scope.$on('Open', function(event, arguments){
		$scope.kanban = kanbanRepository.get(arguments.kanbanName);

		kanbanRepository.setLastUsed(arguments.kanbanName);
		kanbanRepository.save();
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

	var windowHeight = angular.element($window).height() - 180;
	$scope.minHeightOfColumn =  'min-height:'+windowHeight+'px;';
}