'use strict';

var ImportController = function ($scope, $modalInstance, kanbanRepository) {
	$scope.model = {file: '', readError: false, fileSelected: false};

	$scope.close = function(){
		$modalInstance.close(false);
	};

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
				$modalInstance.close(true);
			} catch(exception) {
				$scope.model.readError = true;
			}
		} else {
			$scope.model.readError = true;
		}
	};
}