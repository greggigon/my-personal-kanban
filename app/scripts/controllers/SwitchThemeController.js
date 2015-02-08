'use strict';

var SwitchThemeController = function ($scope, themesProvider, kanbanRepository) {
	$scope.model = {};
	$scope.model.themes = themesProvider.getThemes();
	
	var theme = kanbanRepository.getTheme();
	if (theme == undefined || theme == ''){
		theme = themesProvider.defaultTheme;
	}

	$scope.model.selectedTheme = theme;

	$scope.switchTheme = function(){
		themesProvider.setCurrentTheme($scope.model.selectedTheme);
		kanbanRepository.setTheme($scope.model.selectedTheme);
	};

	$scope.$on('OpenSwitchTheme', function(){
		$scope.showSwitchTheme = true;
	});

};

angular.module('mpk').controller('SwitchThemeController', SwitchThemeController);
