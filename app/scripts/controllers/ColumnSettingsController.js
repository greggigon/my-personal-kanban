'use strict';

var ColumnSettingsController = function ($scope, $timeout) {
	$scope.model = {column: {}, kanban: {}, columnName: '', color: '', limit: '', showWarning: false, deleteDisabled: true};

	$scope.$on('OpenColumnSettings', function(e, kanban, column){
		$scope.showColumnSettings = true;
		$scope.model = {column: column, kanban: kanban, columnName: column.name, showWarning: false, deleteDisabled: true};
		if (column.settings != undefined && column.settings.color != undefined){
			$scope.model.color = column.settings.color;
		}
		if (column.settings && column.settings.limit){
			$scope.model.limit = column.settings.limit;
		}
	});

	$scope.$on('CloseColumnSettings', function(){
		$scope.showColumnSettings = false;
	});
	

	$scope.update = function(){
		var col = $scope.model.column;
		col.name = $scope.model.columnName;
		if (col.settings == undefined){
			col.settings = {};
		}
		col.settings.color = $scope.model.color;
		if ($scope.model.limit != ''){
			col.settings.limit = $scope.model.limit;
		}
		$scope.showColumnSettings = false;
		return true;
	};

	$scope.delete = function(){
		if (!$scope.model.showWarning){
			$scope.model.showWarning = true;
			$timeout(function(){ $scope.model.deleteDisabled = false; }, 2000);
		} else {
			$scope.$emit('DeleteColumn', $scope.model.column);
			$scope.showColumnSettings = false;
		}
	};

	$scope.addColumn = function(direction){
		$scope.$emit('AddColumn', $scope.model.column, direction);
	}
};

angular.module('mpk').controller('ColumnSettingsController', ColumnSettingsController);