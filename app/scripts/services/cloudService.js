'use strict';

angular.module('mpk').factory('cloudService', function($http, $log, $q, $timeout) {
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

		uploadKanban: function(kanban, status){
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
				var compressed = compressString(chunk);
				var params = {kanbanKey: self.settings.kanbanKey, action: 'put', chunk: chunk, chunkNumber:chunkNumber};

				return $http.jsonp('http://localhost:8080/service/kanban?callback=JSON_CALLBACK', {params: params});
			}

			

			var kanbanInChunks = splitSlice(kanban, 1500);
			var promise = sendStart(kanbanInChunks.length);
			
			promise.then(function(){
				var promises = [];

				for (var i=0;i<kanbanInChunks.length;i++){
					promises.push(sendChunk(kanbanInChunks[i], i + 1));
				}

				$q.all(promises).then(function(allPromiseResults){
					// there was no error, probably need to fetch the last-updated and save it to local storage
					console.log('Upload succesfull. Checking MD5 now');
				}, function(errors){ 
					// there should be no errors, if there are errors we need to set some shit
					console.error('One of the uplaods failed. ' + errors);
				});
			}, function(error){
				// Initial handshake has errored
				console.error('Initial handshake errored when trying to upload Kanban');
			});



			// Split the Kanban string into multiple request
			// upload start with /action:put, fragments: 41, kanban: ''
			// upload fragments /action:put, fragment: 1, kanban: 'sdasdad'
			// upload finish with /action:put, fragment : 41, kanban: 'last one' 

			// HASH every single kanban slice, perhaps compress with something.

		},
	};
});
