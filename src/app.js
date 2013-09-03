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

function KanbanCard(name, details, color){
	this.name = name;
	this.details = details;
	this.color = color;
	return this;
}

function KanbanManipulator(){
	return {
		addColumn: function(kanban, columnName){
			kanban.columns.push(new KanbanColumn(columnName));
		},

		addCardToColumn: function(kanban, column, cardTitle, details, color){
			angular.forEach(kanban.columns, function(col){
				if (col.name == column.name){
					col.cards.push(new KanbanCard(cardTitle, details, color));
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

var mpk = angular.module('mpk', ['mpk.service', 'ui.bootstrap'], function($dialogProvider){
	$dialogProvider.options({dialogFade: true, backdropFade: true});
});

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

mpk.directive('focusMe', function($timeout){
	return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
  };
});

mpk.directive('colorSelector', function(){
	return {
		restrict: 'E',
		scope: { options: '=', showRadios: '=', model: '=ngModel', prefix: '@'},
		require: 'ngModel',
		template: '<div class="pull-left" ng-repeat="option in options" ng-model="option">\n'+
				'	<label class="colorBox" for="{{prefix}}{{option}}" ng-class="{selected: option == model}" style="background-color: #{{option}};" ng-click="selectColor(option)"></label>\n'+
                '	<br ng-show="showRadios"/>\n'+
                '	<input type="radio" id="{{prefix}}{{option}}" name="{{prefix}}" value="{{option}}" ng-show="showRadios" ng-model="model"/>\n'+
                '</div>\n',
        link: function(scope) {
        	if (scope.model == undefined || scope.model == ''){
        		scope.model = scope.options[0];
        	};
        	
    		scope.selectColor = function(color){
    			scope.model = color;
    		};
        }
	};
});


function MenuController($scope, kanbanRepository){
	$scope.newKanban = function(){
		$scope.$broadcast('NewKanban');
	};

	$scope.openKanban = function(){
		$scope.$broadcast('OpenKanban');
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
			$scope.openKanban();
		}
		return false;
	};
}

function NewKanbanController($scope, kanbanRepository, kanbanManipulator){
	$scope.newKanbanShouldBeOpen = false;

	$scope.numberOfColumns = 3;
	$scope.kanbanName = '';

	$scope.createNew = function(dialogId){
		if (!$scope.newKanbanForm.$valid){
			return false;
		}
		var newKanban = new Kanban($scope.kanbanName, $scope.numberOfColumns);
		for (i=1;i < parseInt($scope.numberOfColumns) + 1 ; i++){
			kanbanManipulator.addColumn(newKanban, 'Column '+i);
		}
		kanbanRepository.add(newKanban);

		$scope.kanbanName = '';
		$scope.numberOfColumns = 3;
		
		kanbanRepository.setLastUsed(newKanban.name);
		$scope.$emit('ChangeCurrentKanban');
		$scope.newKanbanShouldBeOpen = false;

		return true;
	};

	$scope.$on('NewKanban', function(){
		$scope.newKanbanShouldBeOpen = true;
	});


	$scope.closeNewKanban = function(){
		$scope.newKanbanShouldBeOpen = false;
		$scope.numberOfColumns = 3;
		$scope.kanbanName = '';
	};

}

function NewKanbanCardController($scope, kanbanManipulator){
	
	function initScope($scope){
		$scope.kanbanColumnName = '';
		$scope.column = null;
		$scope.title = '';
		$scope.newCardShouldBeOpen = false;
		$scope.details = '';
		$scope.colorOptions = ['FFFFFF', 'FF8282', '94D6FF', 'F6FCB1', 'A5FC9D', 'F5CE90'];
		$scope.cardColor = $scope.colorOptions[0];	
	}

	$scope.$on('AddNewCard', function(theEvent, args){
		$scope.newCardShouldBeOpen = true;
		$scope.kanbanColumnName = args.column.name;
		$scope.column = args.column;
	});

	$scope.addNewCard = function(){
		if (!$scope.newCardForm.$valid){
			return false;
		}

		$scope.$emit('NewCardRequest', {title: $scope.title, column: $scope.column, details: $scope.details, color: $scope.cardColor});
		initScope($scope);
	};

	$scope.close = function(){
		initScope($scope);
	};

	initScope($scope);
}

function CardController($scope){
	function initScope(scope){
		scope.cardDetailShouldBeOpen = false;
		scope.name = '';
		scope.details = '';
		scope.card = undefined;
	}

	function hexToInt(hex){
		return parseInt(hex, 16);
	}
	

	$scope.$on('OpenCardDetails', function(event, arguments){
		$scope.cardDetailShouldBeOpen = true;
		$scope.name = arguments.card.name;
		$scope.details = arguments.card.details;
		$scope.card = arguments.card;
	});

	$scope.close = function(){
		initScope($scope);
	};

	$scope.update = function(){
		if (!$scope.cardDetails.$valid){
			return false;
		}
		$scope.card.name = $scope.name;
		$scope.card.details = $scope.details;

		initScope($scope);
	};

	$scope.red = function(hexColor){
		return parseInt(hexColor.substr(0,2));
	};

	$scope.green = function(hexColor){
		return parseInt(hexColor.substr(2,2));
	};

	$scope.blue = function(hexColor){
		return parseInt(hexColor.substr(4,2));
	};

	initScope($scope);
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

	$scope.openCardDetails = function(card){
		$scope.$broadcast('OpenCardDetails', {card: card});
	};
}

function OpenKanbanController($scope){
	$scope.openKanbanShouldBeOpen = false;

	$scope.close = function(){
		$scope.openKanbanShouldBeOpen = false;	
	};

	$scope.open = function(){
		if (!$scope.openKanbanForm.$valid){
			return false;
		}
		$scope.$emit('Open', {kanbanName: $scope.selectedToOpen});
		$scope.openKanbanShouldBeOpen = false;
		return true;
	};

	$scope.$on('OpenKanban', function(){
		$scope.openKanbanShouldBeOpen = true;
	});
};

function ApplicationController($scope, $window, kanbanRepository, kanbanManipulator){
	$scope.$on('ChangeCurrentKanban', function(){
		$scope.kanban = kanbanRepository.getLastUsed();
		$scope.allKanbans = Object.keys(kanbanRepository.all());
		$scope.selectedToOpen = $scope.kanban.name;
	});

	$scope.$on('NewCardRequest', function(event, arguments){
		kanbanManipulator.addCardToColumn($scope.kanban, arguments.column, arguments.title, arguments.details, arguments.color);
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