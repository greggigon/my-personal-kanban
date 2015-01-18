'use strict';

var KanbanController = function ($scope, $modal, kanbanManipulator) {
    
    $scope.addNewCard = function(column){
		$scope.$broadcast('AddNewCard', column);
	};

	$scope.delete = function(card, column){
		if (confirm('You sure?')){
			kanbanManipulator.removeCardFromColumn($scope.kanban, column, card);
		}
	};

	$scope.openCardDetails = function(card){
		$modal.open({
			templateUrl: 'OpenCard.html',
			controller: 'CardController',
			resolve: {
				colorOptions: function(){ return $scope.colorOptions; },
				card: function(){ return card; }
			}
		});
	};

	$scope.details = function(card){
		if (card.details !== undefined && card.details !== '') {
			return card.details;
		}
		return card.name;
	};

	$scope.colorFor = function(card){
		return (card.color !== undefined && card.color !== '') ? card.color : $scope.colorOptions[0];
	};

	$scope.isLastColumn = function(column, kanban){
		function last(coll){
			return coll[coll.length - 1];
		}

		return last(kanban.columns).name == column;
	};

	$scope.archive = function(kanban, column, card){
		return kanbanManipulator.archiveCard(kanban, column, card);
	};

	$scope.columnSettings = function(kanban, column){
		$scope.$broadcast('OpenColumnSettings', kanban, column);
	};
};
mpkModule.controller('KanbanController', KanbanController);

