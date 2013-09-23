'use strict';

var NewKanbanCardController = function ($scope, $modalInstance, kanbanManipulator, colorOptions, column) {
	function initScope(scope, colorOptions){
		scope.kanbanColumnName = column.name;
		scope.column = column;
		scope.title = '';
		scope.details = '';
		scope.cardColor = colorOptions[0];
		scope.colorOptions = colorOptions;
	}

	$scope.addNewCard = function(){
		if (!this.newCardForm.$valid){
			return false;
		}
		$modalInstance.close({title: this.title, column: column, details: this.details, color: this.cardColor});
	};

	$scope.close = function(){
		$modalInstance.close();
	};

	initScope($scope, colorOptions);
};