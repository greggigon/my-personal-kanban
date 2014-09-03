'use strict';

var ColumnSettingsController = function ($scope, $modalInstance, kanban, column) {
	$scope.model = {column: column, kanban: kanban, columnName: column.name, color: ''};
	
	if (column.settings != undefined && column.settings.color != undefined){
		$scope.model.color = column.settings.color;
	}

	$scope.close = function(){
		$modalInstance.close();
	};

	$scope.update = function(){
		var col = $scope.model.column;
		col.name = $scope.model.columnName;
		if (col.settings == undefined){
			col.settings = {};
		}
		col.settings.color = $scope.model.color;

		$modalInstance.close();
	};
};