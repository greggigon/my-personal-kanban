'use strict';

describe('Application controller', function(){
	var scope, applicationController, kanbanRepositoryMock, themesProviderMock, window;

	beforeEach(inject(function($rootScope, $controller, $window){
		kanbanRepositoryMock = {
			load: function(){ return validSampleKanban.kanbans;},
			getLastUsed: function(){ return "Stuff to do at home";},
			all: function() { return validSampleKanban.kanbans;},
			getTheme: function() { return 'default-dark'; }
		};
		window = $window;
		themesProviderMock = {setCurrentTheme: function(){}};

		scope = $rootScope.$new();
		applicationController = $controller('ApplicationController', {$scope: scope, kanbanRepository: kanbanRepositoryMock, themesProvider: themesProviderMock, $window: window});
	}));

	it("should switch to editing when clicking Kanban Name editing", function(){
		expect(scope.editingName).toBeFalsy();

		scope.editingKanbanName();

		expect(scope.editingName).toBeTruthy();
	});




	var validSampleKanban = {"kanbans":{"Stuff to do at home":{"name":"Stuff to do at home","numberOfColumns":3,
		"columns":[
			{"name":"Not started","cards":[{"name":"This little piggy went to lunch","color":"CCD0FC"},{"name":"Foo bar","color":"FCE4D4"}]},
			{"name":"In progress","cards":[{"name":"another on a bit longer text this time","color":"FAFFA1"},{"name":"And another one","color":"94D6FF"}]},
			{"name":"Done","cards":[{"name":"bar foo","color":"FCE4D4"},{"name":"Another on","color":"FCC19D"},{"name":"New one","color":"FC9AFB"}]}]},
		"lastUsed":"Stuff to do at home",
		"theme":"default-dark",
		"lastUpdated":"1391554268110"}};
});