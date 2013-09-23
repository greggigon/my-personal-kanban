'use strict';

var NewKanbanController = function ($scope, $modalInstance, kanbanRepository, kanbanManipulator){
	$scope.numberOfColumns = 3;
	$scope.kanbanName = '';

	$scope.createNew = function(){
		if (!this.newKanbanForm.$valid){
			return false;
		}
		var newKanban = new Kanban(this.kanbanName, this.numberOfColumns);
		for (var i=1;i<parseInt(this.numberOfColumns)+1;i++){
			kanbanManipulator.addColumn(newKanban, 'Column '+i);
		}
		kanbanRepository.add(newKanban);

		this.kanbanName = '';
		this.numberOfColumns = 3;
		
		kanbanRepository.setLastUsed(newKanban.name);
		$modalInstance.close(true);

		return true;
	};


	$scope.closeNewKanban = function(){
		$scope.numberOfColumns = 3;
		$scope.kanbanName = '';
		$modalInstance.close();
	};
};