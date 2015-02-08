describe('Export controller', function(){
	beforeEach(module('mpk'));

	var scope, kanbanManipulator;
	var card, archivedCard, column, kanban;
	var $controller, $rootScope;

	beforeEach(inject(function(_$rootScope_, _$controller_){
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
		
		$controller = _$controller_;
		$rootScope = _$rootScope_;

		kanbanManipulator = {
			unarchiveCard: function(kanban, archivedCard){}, 
			removeFromArchive: function(kanban, archivedCard){}};

		spyOn(kanbanManipulator, 'unarchiveCard');
		spyOn(kanbanManipulator, 'removeFromArchive');
	}));

	it('should prepare model with archived cards and selections', function(){
		var scope = $rootScope.$new();
		var controller = $controller('ArchiveController', { 
			$scope: scope, 
			kanbanManipulator: kanbanManipulator});
		
		$rootScope.$broadcast('OpenArchive', kanban);
		expect(scope.model.archived).toBeDefined();
		expect(scope.model.archived.length).toBe(1);
		expect(scope.model.archived[0].selected).toBeFalsy();
		expect(scope.model.archived[0].original).toBeDefined();
	});

	it('should unarchive card', function(){
		var scope = $rootScope.$new();
		var controller = $controller('ArchiveController', { 
			$scope: scope, 
			kanbanManipulator: kanbanManipulator});
		
		$rootScope.$broadcast('OpenArchive', kanban);
		scope.model.archived[0].selected = true;

		expect(scope.model.archived.length).toBe(1);
		
		scope.unarchiveSelected();

		expect(scope.model.archived.length).toBe(0);
		expect(kanbanManipulator.unarchiveCard).toHaveBeenCalledWith(kanban, archivedCard);
	});

	it('should remove card from archive', function(){
		var scope = $rootScope.$new();
		var controller = $controller('ArchiveController', { 
			$scope: scope, 
			kanbanManipulator: kanbanManipulator});

		$rootScope.$broadcast('OpenArchive', kanban);

		scope.model.archived[0].selected = true;
		expect(scope.model.archived.length).toBe(1);

		scope.deleteSelected();
		expect(scope.model.archived.length).toBe(0);
		expect(kanbanManipulator.removeFromArchive).toHaveBeenCalledWith(kanban, archivedCard);
	});

});