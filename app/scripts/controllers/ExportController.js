'use strict';

var ExportController = function ($scope, $modalInstance, kanbanRepository, fileService, allKanbanNames, currentKanban) {
	$scope.model = {exportAll: false};
	$scope.model.allKanbanNames = allKanbanNames;
	$scope.model.selectedKanban = currentKanban;

	$scope.close = function(){
		$modalInstance.close();
	};

	$scope.doExport = function(){
		var toExport = null;
		var fileName = $scope.model.selectedKanban + '-export.json';
		
		if ($scope.model.exportAll){
			var kanbans = kanbanRepository.all();
			toExport = new Blob([angular.toJson(kanbans, true)], {type: 'application/json;charset=utf-8'});
			fileName = 'all-kanbans-export.json';
		} else {
			var kanban = kanbanRepository.get($scope.model.selectedKanban);
			toExport = new Blob([angular.toJson(kanban, true)], {type: 'application/json;charset=utf-8'});
		}

		fileService.saveBlob(toExport, fileName);
		
		$modalInstance.close();
	};

}