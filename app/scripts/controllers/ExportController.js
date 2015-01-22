'use strict';

angular.module('mpk').controller('ExportController', function ExportController($scope, kanbanRepository, fileService) {
	$scope.model = {exportAll: false, allKanbanNames: [], selectedKanban: ''};
	$scope.showExportModal = false;

	$scope.$on('OpenExport', function(e, allKanbanNames, current){
		$scope.model.allKanbanNames = allKanbanNames;
		$scope.model.selectedKanban = current;

		$scope.showExportModal = true;
	})


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
		$scope.showExportModal = false;
		return true;
	};

});