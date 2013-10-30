'use strict';

angular.module('mpk').factory('cloudService', function($http) {
	return {
		settings: {},
		loadSettings: function() {
			var settings = localStorage.getItem('myPersonalKanban.cloudSettings');
			if (settings == undefined){
				this.settings.notSetup = true;
				return this.settings;
			}
			this.settings = angular.fromJson(settings);
			this.settings.notSetup = false;
			return this.settings;
		},

		saveSettings: function(settings){
			this.settings = settings;
			localStorage.setItem('myPersonalKanban.cloudSettings', angular.toJson(this.settings));
			return this.settings;
		},

		uploadKanban: function(kanban){
			var params = { 'kanbanKey': settings.kanbanKey, action: 'put','kanban': kanban };
			$http.jsonp('http://localhost:8080/service/kanban?callback=JSON_CALLBACK', {params: params}).
				error(function(data, status){
					$log.error(data);
				}).success(function(data){ 
                    $log.log(data);
                });
		},
	};
});
