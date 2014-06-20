'use strict';

var ExportController = function ($scope, $modalInstance, kanbanRepository, allKanbanNames, currentKanban) {
	$scope.model = {};
	$scope.model.allKanbanNames = allKanbanNames;
	$scope.model.currentKanban = currentKanban;

	$scope.close = function(){
		$modalInstance.close();
	};
}