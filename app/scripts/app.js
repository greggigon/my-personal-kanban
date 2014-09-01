'use strict';

angular.module('mpk', ['ui.bootstrap', 'ngSanitize', 'ui.utils', 'ngRoute', 'angularSpectrumColorpicker'])
.config(function($routeProvider, $locationProvider) {
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
});;
