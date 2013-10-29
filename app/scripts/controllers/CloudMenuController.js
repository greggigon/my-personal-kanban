'use strict';

var CloudMenuController = function($scope, $modal){
	$scope.openCloudSetup = function(){
		var modalInstance = $modal.open({
			templateUrl: 'SetupCloudModal.html',
			controller: 'SetupCloudController'
		});
	}
};
