'use strict';

angular.module('mpk').controller('KanbanController', function KanbanController($scope, kanbanManipulator) {
    
    $scope.addNewCard = function(column){
		$scope.$broadcast('AddNewCard', column);
	};

	$scope.delete = function(card, column){
		if (confirm('You sure?')){
			kanbanManipulator.removeCardFromColumn($scope.kanban, column, card);
		}
	};

	$scope.openCardDetails = function(card){
		$scope.$broadcast('OpenCardDetails', card);
	};

	$scope.detailsFor = function(card){
		if (card.details !== undefined && card.details !== '') {
			return card.details;
		}
		return card.name;
	};

	$scope.columnLimitsTextFor = function(column){
		if (column.settings.limit != '' && column.settings.limit != undefined){
			return column.cards.length + " of " + column.settings.limit;
		}
		return column.cards.length;
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
});

