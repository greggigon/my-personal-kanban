'use strict';

var ExportController = function ($scope, $modalInstance, kanbanRepository, allKanbanNames, currentKanban) {
	$scope.model = {fileFormat: 'json', fileFormats: ['json', 'csv']};
	$scope.model.allKanbanNames = allKanbanNames;
	$scope.model.selectedKanban = currentKanban;

	$scope.close = function(){
		$modalInstance.close();
	};

	
}