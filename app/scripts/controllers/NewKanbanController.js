'use strict';

var NewKanbanController = function ($scope, kanbanRepository, kanbanManipulator){
	$scope.model = {useTemplate: ''};
	$scope.kanbanName = '';
	$scope.numberOfColumns = 3;
	$scope.model.kanbanNames = [];

	$scope.$on('OpenNewKanban', function(e, allKanbanNames){
		$scope.showNewKanban = true;
		$scope.model.kanbanNames = allKanbanNames;
	});

	$scope.createNew = function(){
		if (!this.newKanbanForm.$valid){
			return false;
		}

		var newKanban = new Kanban(this.kanbanName, this.numberOfColumns);

		if ($scope.model.useTemplate != ''){
			var templateKanban = kanbanRepository.all()[$scope.model.useTemplate];
			newKanban = kanbanManipulator.createNewFromTemplate(templateKanban, this.kanbanName);
		} else {
			for (var i=1;i<parseInt(this.numberOfColumns)+1;i++){
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