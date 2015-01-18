'use strict';

var NewKanbanCardController = function ($scope, kanbanManipulator) {
	$scope.$on('AddNewCard', function(e, column){
		$scope.kanbanColumnName = column.name;
		$scope.column = column;
		$scope.title = '';
		$scope.details = '';
		$scope.cardColor = $scope.colorOptions[0];
		$scope.showNewCard = true;
	});

	$scope.addNewCard = function(){
		if (!this.newCardForm.$valid){
			return false;
		}
		kanbanManipulator.addCardToColumn($scope.kanban, $scope.column, this.title, this.details, this.color);

		return true;
	};

};

angular.module('mpk').controller('NewKanbanCardController', NewKanbanCardController);