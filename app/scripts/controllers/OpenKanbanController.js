'use strict';

var OpenKanbanController = function ($scope, $modalInstance, allKanbans, currentKanban) {
	$scope.allKanbans = allKanbans;
	$scope.selectedToOpen = currentKanban.name;

	$scope.close = function(){
		$modalInstance.close();
	};

	$scope.open = function(){
		if (!this.openKanbanForm.$valid){
			return false;
		}
		$modalInstance.close(this.selectedToOpen);
		return true;
	};
};
