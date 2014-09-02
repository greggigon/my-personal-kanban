		
describe('Application controller', function(){
	var scope, applicationController, kanbanRepositoryMock, themesProviderMock, window;
	var renamer, saver;

	beforeEach(inject(function($rootScope, $controller, $window){
		renamer = jasmine.createSpy('Kanban Rename Function');
		saver = jasmine.createSpy('Kanban Saver');
		kanbanRepositoryMock = {
			load: function(){ return validSampleKanban.kanbans;},
			getLastUsed: function(){ return validSampleKanban.kanbans['Stuff to do at home']},
			all: function() { return validSampleKanban.kanbans;},
			getTheme: function() { return 'default-dark'; },
			renameLastUsedTo: renamer,
			save: saver,
			get: function(name) { return validSampleKanban.kanbans[name]; },
			setLastUsed: function(kanban) { return kanban; },
		};
		window = $window;
		themesProviderMock = {setCurrentTheme: function(){}};

		scope = $rootScope.$new();
		applicationController = $controller('ApplicationController', {$scope: scope, kanbanRepository: kanbanRepositoryMock, themesProvider: themesProviderMock, $window: window, $routeParams: {}});
	}));

	it("should change name of the Kanban to new name", function(){
		scope.newName = 'foobarboo';
		scope.allKanbans = [];

		scope.rename();

		expect(renamer).toHaveBeenCalledWith(scope.newName);
		expect(saver).toHaveBeenCalled();
		expect(scope.allKanbans).not.toEqual([]);
	});

	it("should set the Text field variable of the name", function(){
		expect(scope.newName).toBe('Stuff to do at home');
	});

	it("should switch to editing when clicking Kanban Name editing", function(){
		expect(scope.editingName).toBeFalsy();

		scope.editingKanbanName();

		expect(scope.editingName).toBeTruthy();
	});

	it("should add switch to option to Switch Menu", function(){
		expect(scope.switchToList.length).toBe(scope.allKanbans.length+1);
	});

	var validSampleKanban = {"kanbans":
		{"Stuff to do at home":{"name":"Stuff to do at home","numberOfColumns":3,
			"columns":[
				{"name":"Not started","cards":[{"name":"This little piggy went to lunch","color":"CCD0FC"},{"name":"Foo bar","color":"FCE4D4"}]},
				{"name":"In progress","cards":[{"name":"another on a bit longer text this time","color":"FAFFA1"},{"name":"And another one","color":"94D6FF"}]},
				{"name":"Done","cards":[{"name":"bar foo","color":"FCE4D4"},{"name":"Another on","color":"FCC19D"},{"name":"New one","color":"FC9AFB"}]}
			]
		}, 
		"foobarboo":{"name":"foobarboo","numberOfColumns":3,
			"columns":[
				{"name":"Col 1","cards":[]},
				{"name":"Col 2","cards":[]},
				{"name":"Col 3","cards":[]},
			]
		}},
		"lastUsed":"Stuff to do at home",
		"theme":"default-dark",
		"lastUpdated":"1391554268110"};
});