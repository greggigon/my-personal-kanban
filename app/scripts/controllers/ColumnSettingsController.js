'use strict';

var ColumnSettingsController = function ($scope) {
	$scope.model = {column: {}, kanban: {}, columnName: '', color: ''};

	$scope.$on('OpenColumnSettings', function(e, kanban, column){
		$scope.showColumnSettings = true;
		if (column.settings != undefined && column.settings.color != undefined){
			$scope.model.color = column.settings.color;
		}
		$scope.model = {column: column, kanban: kanban, columnName: column.name};
	});
	

	$scope.update = function(){
		var col = $scope.model.column;
		col.name = $scope.model.columnName;
		if (col.settings == undefined){
			col.settings = {};
		}
		col.settings.color = $scope.model.color;
		$scope.showColumnSettings = false;
		return true;
	};
};

angular.module('mpk').controller('ColumnSettingsController', ColumnSettingsController);