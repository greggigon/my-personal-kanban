'use strict';

var CloudMenuController = function($scope, $modal, kanbanRepository){
	$scope.openCloudSetup = function(){
		var modalInstance = $modal.open({
			templateUrl: 'SetupCloudModal.html',
			controller: 'SetupCloudController'
		});
	};

	$scope.upload = function(){
		kanbanRepository.upload();
		return false;
	};

	$scope.download = function(){
		kanbanRepository.download();
		return false;
	};
};
