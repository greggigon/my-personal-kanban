'use strict';

var ArchiveController = function ($scope, $modalInstance, kanban, kanbanManipulator) {

	function prepareArchivedCardsForCheckboxes(archived){
		var prepared = [];
		angular.forEach(archived, function(archivedCard, index){
			prepared.push({card: archivedCard.card, archivedOn: archivedCard.archivedOn, selected: false, original: archivedCard});
		});
		return prepared;
	}

	$scope.model = { archived: prepareArchivedCardsForCheckboxes(kanban.archived), selectedCards: [], kanban: kanban};

	$scope.formatDate = function(date){
		var date = new Date(Date.parse(date));
		return date.toUTCString();
	};

	$scope.unarchiveSelected = function(){
		angular.forEach($scope.model.archived, function(archivedWithSelection){
			if (archivedWithSelection.selected){
				kanbanManipulator.unarchiveCard($scope.model.kanban, archivedWithSelection.original);
				$scope.model.archived.splice($scope.model.archived.indexOf(archivedWithSelection), 1);
			}
		})
	};

	$scope.close = function(){
		console.log($scope.model.archived);
		$modalInstance.close();
	};

}