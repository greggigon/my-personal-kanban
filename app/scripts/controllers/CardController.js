'use strict';

var CardController = function ($scope) {
	$scope.card = {};
	$scope.editTitle = false;

	$scope.editingDetails = false;
	$scope.editingTitle = false;


	$scope.$on('OpenCardDetails', function(e, card){
		$scope.card = card;

		$scope.editingDetails = false;
		$scope.editingTitle = false;

		$scope.showCardDetails = true;
	});

};
mpkModule.controller('CardController', CardController);
