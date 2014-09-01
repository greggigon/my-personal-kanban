describe('Kanban controller', function(){
	var scope, kanbanController;


	beforeEach(inject(function($rootScope, $controller){
		fileService = {saveBlob: function(blob, fileName){ }};
		spyOn(fileService, 'saveBlob');

		scope = $rootScope.$new();

		kanbanController = $controller('KanbanController', {$scope: scope, $modal: {}, kanbanManipulator: {}});
	}));

	describe('Checking for last column in Kanban', function(){

		var kanban = {
		  "name": "Stuff to do",
		  "numberOfColumns": 3,
		  "columns": [
		    {
		      "name": "Not started",
		      "cards": [
		      ]
		    },
		    {
		      "name": "In progress",
		      "cards": [
		      ]
		    },
		    {
		      "name": "Done",
		      "cards": [
		      ]
		    }
		  ]
		};
		
		it('should return true if the column is last in the kanban', function(){
			expect(scope.isLastColumn('Done', kanban)).toBeTruthy();
		});

		it('should return false if the column is not last', function(){
			expect(scope.isLastColumn('In Progress', kanban)).toBeFalsy();
			expect(scope.isLastColumn('Not started', kanban)).toBeFalsy();
		});

			
	})

});