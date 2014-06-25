'use strict';

var ArchiveController = function ($scope, $modalInstance, kanban) {
	$scope.model = { kanban: kanban};

	$scope.formatDate = function(date){
		var date = new Date(Date.parse(date));
		return date.toUTCString();
	};

	$scope.close = function(){
		$modalInstance.close();
	};
}