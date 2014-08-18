'use strict';

var ColumnSettingsController = function ($scope, $modalInstance, kanban, column) {
	$scope.model = {column: column, kanban: kanban, columnName: column.name};

	$scope.close = function(){
		$modalInstance.close();
	};

	$scope.update = function(){
		$scope.model.column.name = $scope.model.columnName;
		
		$modalInstance.close();
	};

};