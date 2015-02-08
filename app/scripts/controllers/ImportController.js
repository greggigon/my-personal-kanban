'use strict';

angular.module('mpk').controller('ImportController', function ImportController($scope, kanbanRepository) {
	$scope.model = {file: '', readError: false, fileSelected: false};
	$scope.showImportModal = false;

	$scope.$on('OpenImport', function(){
		$scope.model = {file: '', readError: false, fileSelected: false};
		$scope.showImportModal = true;
	})

	$scope.import = function(){

		function singleKanban(kanbanObject){
			var keys = Object.keys(kanbanObject);
			return keys.lastIndexOf('columns') > -1;
		}

		if ($scope.model.file != ''){
			try {
				var kanbanOrKanbans = angular.fromJson($scope.model.file);
				if (singleKanban(kanbanOrKanbans)){
					var toImport = {};
					toImport[kanbanOrKanbans.name] = kanbanOrKanbans;
					kanbanRepository.import(toImport);
				} else {
					kanbanRepository.import(kanbanOrKanbans);
				}
				$scope.$emit('DownloadFinished');
				$scope.showImportModal = false;
			} catch(exception) {
				$scope.model.readError = true;
			}
		} else {
			$scope.model.readError = true;
		}
	};

});