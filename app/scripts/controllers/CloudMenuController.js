'use strict';

var CloudMenuController = function($scope, $modal, kanbanRepository){
	$scope.openCloudSetup = function(){
		var modalInstance = $modal.open({
			templateUrl: 'SetupCloudModal.html',
			controller: 'SetupCloudController'
		});
	};

	$scope.upload = function(){
		var promise = kanbanRepository.upload();
		$scope.$emit('UploadStarted');
		promise.then(function(result){
			kanbanRepository.setLastUpdated(result.data.lastUpdated).save();
			// stop spinner, flash uploaded, save last updated
			$scope.$emit('UploadFinished');
		}, function(errors){ 
			// stop spinner show error message
		});
		return false;
	};

	$scope.download = function(){
		kanbanRepository.download();
		return false;
	};
};
