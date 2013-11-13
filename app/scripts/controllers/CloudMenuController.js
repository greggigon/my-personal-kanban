'use strict';

var CloudMenuController = function($scope, $modal, kanbanRepository, $q){
	$scope.openCloudSetup = function(){
		var modalInstance = $modal.open({
			templateUrl: 'SetupCloudModal.html',
			controller: 'SetupCloudController'
		});
	};

	$scope.upload = function(){
		var promise = kanbanRepository.upload();
		promise.success(function(result){
			var lastUpdated = result.data.lastUpdated;
			kanbanRepository.setLastUpdated(lastUpdated).save();

		}).error(function(failures){

			console.log('Failure');
			console.log(failures);
		});
		return false;
	};

	$scope.download = function(){
		kanbanRepository.download();
		return false;
	};
};
