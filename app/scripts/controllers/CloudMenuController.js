'use strict';

var CloudMenuController = function($scope, $modal, kanbanRepository, cloudService, cryptoService){
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
		var serializedKanbans = kanbanRepository.prepareSerializedKanbans();
		var promise = cloudService.upload(serializedKanbans);

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
		var promise = cloudService.download();
		promise.success(function(data){
			if (data.success){
				if (typeof(data.kanban) == 'string'){
			        try {
			          	var decryptedKanban = cryptoService.decrypt(data.kanban, cloudService.settings.encryptionKey);
						kanbanRepository.saveDownloadedKanban(decryptedKanban, data.lastUpdated);
						$scope.$emit('DownloadFinished');
			        } catch (ex){
			        	console.debug(ex);
			        	$scope.$emit('DownloadFinishedWithError', "Looks like Kanban saved in the cloud was persisted with different encryption key. You'll need to use old key to download your Kanban. Set it up in the Cloud Setup menu.");
			        	return false;
			        }
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

