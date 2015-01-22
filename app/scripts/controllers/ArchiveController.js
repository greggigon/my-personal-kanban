'use strict';

angular.module('mpk').controller('ArchiveController', function ArchiveController($scope, kanbanManipulator) {
	$scope.model = {kanban: {}, archived: [], selectedCards: []};
	$scope.showArchive = false;


	$scope.$on('OpenArchive', function(e, kanban){
		$scope.model.archived = prepareArchivedCardsForCheckboxes(kanban.archived);
		$scope.model.kanban = kanban;
		$scope.model.selectedCards = [];
		$scope.showArchive = true;
	});

	function prepareArchivedCardsForCheckboxes(archived){
		var prepared = [];
		angular.forEach(archived, function(archivedCard, index){
			prepared.push({card: archivedCard.card, archivedOn: archivedCard.archivedOn, selected: false, original: archivedCard});
		});
		return prepared;
	}


	$scope.formatDate = function(date){
		var date = new Date(Date.parse(date));
		return date.toUTCString();
	};

	$scope.unarchiveSelected = function(){
		angular.forEach($scope.model.archived, function(archivedWithSelection){
			if (archivedWithSelection.selected){
				$scope.model.archived.splice($scope.model.archived.indexOf(archivedWithSelection), 1);
				kanbanManipulator.unarchiveCard($scope.model.kanban, archivedWithSelection.original);
			}
		});
	};

	$scope.deleteSelected = function(){
		angular.forEach($scope.model.archived, function(archivedWithSelection){
			if (archivedWithSelection.selected){
				$scope.model.archived.splice($scope.model.archived.indexOf(archivedWithSelection), 1);
				kanbanManipulator.removeFromArchive($scope.model.kanban, archivedWithSelection.original);
			}
		});
	};

});