'use strict';

angular.module('mpk').factory('cloudService', function($http, $log, $q, $timeout, cryptoService) {
	return {
		settings: {notLoaded: true},
		loadSettings: function() {
			var settings = localStorage.getItem('myPersonalKanban.cloudSettings');
			if (settings == undefined){
				this.settings = {notSetup: true};
				return this.settings;
			}
			this.settings = angular.fromJson(settings);
			this.settings.notSetup = false;
			return this.settings;
		},

		saveSettings: function(settings){
			this.settings = settings;
			localStorage.setItem('myPersonalKanban.cloudSettings', angular.toJson(this.settings, false));
			return this.settings;
		},

		downloadKanban: function(){
			if (this.settings.notLoaded) {
				this.loadSettings();
			}
			var params = {kanbanKey: this.settings.kanbanKey, action: 'get'};
			return $http.jsonp('http://localhost:8080/service/kanban?callback=JSON_CALLBACK', {params: params});
		},

		uploadKanban: function(kanban){
			if (this.settings.notLoaded) {
				this.loadSettings();
			}
			var self = this;

			function splitSlice(str, len) {
				var ret = [ ];
				for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
					ret.push(str.slice(offset, len + offset));
				}
				return ret;
			};

			function sendStart(numberOfFragments) {
				var params = {kanbanKey: self.settings.kanbanKey, action: 'put', fragments: numberOfFragments};
				
				return $http.jsonp('http://localhost:8080/service/kanban?callback=JSON_CALLBACK', {params: params});
			};

			function sendChunk(chunk, chunkNumber){
				var params = {kanbanKey: self.settings.kanbanKey, action: 'put', chunk: chunk, chunkNumber:chunkNumber};

				return $http.jsonp('http://localhost:8080/service/kanban?callback=JSON_CALLBACK', {params: params});
			};

			function checkKanbanValidity(kanban){
				var hash = cryptoService.md5Hash(kanban);
				var params = {kanbanKey: self.settings.kanbanKey, action: 'put', hash: hash};

				return $http.jsonp('http://localhost:8080/service/kanban?callback=JSON_CALLBACK', {params: params}); 
			};

			var kanbanInChunks = splitSlice(kanban, 1500);

			var promise = sendStart(kanbanInChunks.length);
			angular.forEach(kanbanInChunks, function(value, index){
				promise = promise.then(function(){ 
					return sendChunk(value, index + 1);
				});
			});


			return promise.then(function(){
				return checkKanbanValidity(kanban);
			});
		},
	};
});
