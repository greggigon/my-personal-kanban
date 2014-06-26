'use strict';

var ArchiveController = function ($scope, $modalInstance, kanban) {

	function prepareArchivedCardsForCheckboxes(archived){
		var prepared = [];
		angular.forEach(archived, function(archivedCard){
			prepared.push({card: archivedCard.card, archivedOn: archivedCard.archivedOn, selected: false});
		});
		return prepared;
	}

	$scope.model = { archived: prepareArchivedCardsForCheckboxes(kanban.archived), selectedCards: []};

	$scope.formatDate = function(date){
		var date = new Date(Date.parse(date));
		return date.toUTCString();
	};

	$scope.close = function(){
		console.log($scope.model.archived);
		$modalInstance.close();
	};

}