'use strict';

var MenuController = function ($scope, kanbanRepository, $modal, $timeout) {
	$scope.newKanban = function(){
		var modalInstance = $modal.open({
			templateUrl: 'NewKanbanModal.html',
			controller: 'NewKanbanController'
		});

		modalInstance.result.then(function(created){
			if (created){
				$timeout(function(){$scope.$emit('NewKanbanAdded');});
			}
		});
	};

	$scope.delete = function(){
		if (confirm('You sure you want to delete the entire Kanban?')){
			kanbanRepository.remove($scope.kanban.name);
			var all = kanbanRepository.all();
			var names = Object.keys(all);
			if (names.length > 0){
				kanbanRepository.setLastUsed(names[0]);
			} else {
				kanbanRepository.setLastUsed(undefined);
			}
			$scope.$emit('KanbanDeleted');
			$scope.openKanban();
		}
		return false;
	};

	$scope.selectTheme = function(){
		$modal.open({
			templateUrl: 'SelectTheme.html',
			controller: 'SwitchThemeController'
		});
	};

	$scope.help = function(){
		var modalInstance = $modal.open({
			templateUrl: 'HelpModal.html',
			controller: 'HelpController',
			windowClass: 'help'
		});
	};

	$scope.$on('TriggerHelp', function(){
		$scope.help();
	});

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
