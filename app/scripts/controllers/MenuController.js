'use strict';

var MenuController = function ($scope, kanbanRepository, $modal, $timeout, $rootScope) {
	function allKanbanNames(kanbanRepository){
		return Object.keys(kanbanRepository.all());
	}

	$scope.selectTheme = function(){
		$modal.open({
			templateUrl: 'SelectTheme.html',
			controller: 'SwitchThemeController'
		});
	};

	$scope.export = function(allKanbans, currentKanban){
		var modalInstance = $modal.open({
			templateUrl: 'ExportModal.html',
			controller: 'ExportController',
			resolve: { 
				allKanbanNames: function(){ return allKanbans; },
				currentKanban: function(){ return currentKanban; }
			}
		});
	};

	$scope.import = function(){
		var modalInstance = $modal.open({
			templateUrl: 'ImportModal.html',
			controller: 'ImportController',
			resolve: {
				kanbanRepository: function(){ return kanbanRepository; },
			}
		});
		modalInstance.result.then(function(imported){
			if (imported){
				$rootScope.$broadcast('DownloadFinished');
			}
		});
	};

	$scope.openArchive = function(currentKanban){
		$modal.open({
			templateUrl: 'ArchiveModal.html',
			controller: 'ArchiveController',
			windowClass: 'archive',
			resolve: {
				kanban: function(){ return currentKanban; }
			}
		})
	};
};
mpkModule.controller('MenuController', MenuController);