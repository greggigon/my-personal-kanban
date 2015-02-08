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
			if (result.data.success){
				kanbanRepository.setLastUpdated(result.data.lastUpdated).save();
				$scope.$emit('UploadFinished');
			} else {
				$scope.$emit('UploadFinishedWithErrors', result.data.error);
				console.error(result);
			}
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
				var saveResult = kanbanRepository.saveDownloadedKanban(data.kanban, data.lastUpdated);
				if (saveResult.success){
					$scope.$emit('DownloadFinished');
				} else {
					$scope.$emit('DownloadFinishedWithError', saveResult.message);
				}
			} else {
				$scope.$emit('DownloadFinishedWithError', data.error);
			}
		}).error(function(data, status, headers, config){
			$scope.$emit('DownloadError', data);
		});
		return false;
	};
};
mpkModule.controller('CloudMenuController', CloudMenuController);

