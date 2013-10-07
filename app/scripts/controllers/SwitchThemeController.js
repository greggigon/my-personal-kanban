'use strict';

var SwitchThemeController = function ($scope, $modalInstance) {
	$scope.model = {};
	$scope.model.themes = ['default-bright', 'default-dark'];

	$scope.close = function(){
		$modalInstance.close();
	};

	$scope.switchTeme = function(){
		var themeStylesheet = document.getElementById('themeStylesheet');
		var pathPart = themeStylesheet.href.substr(0, themeStylesheet.href.lastIndexOf('/'));
		themeStylesheet.href = pathPart + "/" + $scope.model.selectedTheme + '.css';
		$modalInstance.close();
	};

};
