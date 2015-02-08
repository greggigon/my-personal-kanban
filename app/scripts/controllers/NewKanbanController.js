'use strict';

var NewKanbanController = function ($scope, kanbanRepository, kanbanManipulator){
	$scope.model = {};

	$scope.$on('OpenNewKanban', function(e, allKanbanNames){
		$scope.model.kanbanNames = allKanbanNames;
		$scope.model.kanbanName = '';
		$scope.model.numberOfColumns = 3;
		$scope.model.useTemplate = '';

		$scope.showNewKanban = true;
	});

	$scope.createNew = function(){
		if (!this.newKanbanForm.$valid){
			return false;
		}

		var newKanban = new Kanban($scope.model.kanbanName, $scope.model.numberOfColumns);

		if ($scope.model.useTemplate != ''){
			var templateKanban = kanbanRepository.all()[$scope.model.useTemplate];
			newKanban = kanbanManipulator.createNewFromTemplate(templateKanban, $scope.model.kanbanName);
		} else {
			for (var i=1;i<parseInt($scope.model.numberOfColumns)+1;i++){
				kanbanManipulator.addColumn(newKanban, 'Column '+i);
			}
		}

		kanbanRepository.add(newKanban);

		$scope.kanbanName = '';
		$scope.numberOfColumns = 3;
		
		kanbanRepository.setLastUsed(newKanban.name);

		$scope.$emit('NewKanbanAdded');
		$scope.showNewKanban = false;

		return true;
	};

};

angular.module('mpk').controller('NewKanbanController', NewKanbanController);