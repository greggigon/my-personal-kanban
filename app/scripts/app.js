'use strict';

var mpkModule = angular.module('mpk', ['ngSanitize', 'ngRoute', 'angularSpectrumColorpicker']);

mpkModule.config(function($routeProvider, $locationProvider) {
	$routeProvider
	  	.when('/kanban', {
			templateUrl: 'kanban.html',
		    controller: 'ApplicationController'
		})
		.when('/kanban/:kanbanName', {
			templateUrl: 'kanban.html',
			controller: 'ApplicationController'
		})
		.otherwise({
			redirectTo: '/kanban'
		});
});
