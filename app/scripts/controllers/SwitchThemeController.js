'use strict';

var SwitchThemeController = function ($scope, $modalInstance, themesProvider, kanbanRepository) {
	$scope.model = {};
	$scope.model.themes = themesProvider.getThemes();
	var theme = kanbanRepository.getTheme();
	if (theme == undefined || theme == ''){
		theme = themesProvider.defaultTheme;
	}
	$scope.model.selectedTheme = theme;
	
	$scope.close = function(){
		$modalInstance.close();
	};

	$scope.switchTheme = function(){
		themesProvider.setCurrentTheme($scope.model.selectedTheme);
		kanbanRepository.setTheme($scope.model.selectedTheme);
		$modalInstance.close();
	};

};
