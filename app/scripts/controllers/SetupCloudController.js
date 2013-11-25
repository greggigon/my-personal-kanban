'use strict';

var SetupCloudController = function($scope, $modalInstance, cloudService, showConfigurationError){
	$scope.model = {};
	$scope.model.showConfigurationError = showConfigurationError;

	$scope.close = function(){
		$modalInstance.close();
	};

	$scope.saveSettings = function(){
		if ($scope.model.kanbanKey != undefined && $scope.model.kanbanKey.length != 0){
			var settings = {kanbanKey: $scope.model.kanbanKey};
			cloudService.saveSettings(settings);

			$scope.close();
		}
	};

	$scope.validateKanbanKey = function(){
		// send request, get promise and see if it's any good. If it's good, it's good :)
	};

	var settings = cloudService.loadSettings();
	
	if (!settings.notSetup){
		$scope.model.kanbanKey = settings.kanbanKey;
	}

};