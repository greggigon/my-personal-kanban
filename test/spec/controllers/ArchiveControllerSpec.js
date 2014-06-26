describe('Export controller', function(){
	var scope, kanbanManipulator, modalInstance;
	var card, archivedCard, column, kanban;

	beforeEach(inject(function($rootScope, $controller){
		card = new KanbanCard('Foo bar', '', '');
		archivedCard = {archivedOn: new Date(), card: card};
		column = {"name": "Done", "cards": []};
		kanban = {
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
		    column
		  ],
		  "archived": [archivedCard]
		};

		kanbanManipulator = {
			unarchiveCard: function(kanban, archivedCard){}, 
			removeFromArchive: function(kanban, archivedCard){}};

		spyOn(kanbanManipulator, 'unarchiveCard');
		spyOn(kanbanManipulator, 'removeFromArchive');
		
		scope = $rootScope.$new();
		modalInstance = {close: function(){}};
		
		exportController = $controller('ArchiveController', { 
			$scope: scope, 
			$modalInstance: modalInstance, 
			kanban: kanban, 
			kanbanManipulator: kanbanManipulator});
	}));

	it('should prepare model with archived cards and selections', function(){
		expect(scope.model.archived).toBeDefined();
		expect(scope.model.archived.length).toBe(1);
		expect(scope.model.archived[0].selected).toBeFalsy();
		expect(scope.model.archived[0].original).toBeDefined();
	});

	it('should unarchive card', function(){
		scope.model.archived[0].selected = true;

		expect(scope.model.archived.length).toBe(1);
		
		scope.unarchiveSelected();

		expect(scope.model.archived.length).toBe(0);
		expect(kanbanManipulator.unarchiveCard).toHaveBeenCalledWith(kanban, archivedCard);
	});

	it('should remove card from archive', function(){
		scope.model.archived[0].selected = true;
		expect(scope.model.archived.length).toBe(1);

		scope.deleteSelected();
		expect(scope.model.archived.length).toBe(0);
		expect(kanbanManipulator.removeFromArchive).toHaveBeenCalledWith(kanban, archivedCard);
	});

});