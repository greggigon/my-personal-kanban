'use strict';

var CloudMenuController = function($scope, $modal, kanbanRepository, cloudService){
	$scope.openCloudSetup = function(showConfigurationError){
		var modalInstance = $modal.open({
			templateUrl: 'SetupCloudModal.html',
			controller: 'SetupCloudController',
			resolve: { showConfigurationError: function(){ return showConfigurationError; }}
		});
		return false;
	};

	$scope.upload = function(){
		if (!cloudService.isConfigurationValid()){
			return $scope.openCloudSetup(true);
		}
		var promise = kanbanRepository.upload();
		$scope.$emit('UploadStarted');
		promise.then(function(result){
			kanbanRepository.setLastUpdated(result.data.lastUpdated).save();
			$scope.$emit('UploadFinished');
		}, function(errors){ 
			$scope.$emit('UploadError');
		});
		return false;
	};

	$scope.download = function(){
		if (!cloudService.isConfigurationValid()){
			return $scope.openCloudSetup(true);
		}
		$scope.$emit('DownloadStarted');
		var promise = kanbanRepository.download();
		promise.success(function(data){
			if (data.success){
				kanbanRepository.saveDownloadedKanban(data.kanban, data.lastUpdated);
				$scope.$emit('DownloadFinished');
			} else {
				$scope.$emit('DownloadFinishedWithError', data.error);
			}
		}).error(function(data, status, headers, config){
			$scope.$emit('DownloadError', data);
		});
		return false;
	};
};
