function MenuController($scope){
	$scope.newKanbanAction = function(){
		return false;
	}
}

function NewKanbanController($scope){
	$scope.numberOfColumns = 3;
	$scope.createNew = function(){
		console.log($scope.kanbanName + " - " + $scope.numberOfColumns);
		return true;
	}
}