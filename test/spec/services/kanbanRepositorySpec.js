'use strict';

describe("Kanban Repository", function(){

	var repository;

	beforeEach(module('mpk'));
	beforeEach(inject(['kanbanRepository', function(kanbanRepository){
		repository = kanbanRepository;

		localStorage.setItem('myPersonalKanban', angular.toJson({"kanbans":{"Stuff to do at home":{"name":"Stuff to do at home","numberOfColumns":3,
			"columns":[
				{"name":"Not started","cards":[{"name":"This little piggy went to lunch","color":"CCD0FC"},{"name":"Foo bar","color":"FCE4D4"}]},
				{"name":"In progress","cards":[{"name":"another on a bit longer text this time","color":"FAFFA1"},{"name":"And another one","color":"94D6FF"}]},
				{"name":"Done","cards":[{"name":"bar foo","color":"FCE4D4"},{"name":"Another on","color":"FCC19D"},{"name":"New one","color":"FC9AFB"}]}]},
			"lastUsed":"Stuff to do at home",
			"theme":"default-dark",
			"lastUpdated":"1391554268110"}}));
	}]));

	it("should rename the kanbans", function(){
		repository.load();
		repository.renameLastUsedTo('Stuff to do');
		repository.save();
		repository.load();

		expect(repository.getLastUsed().name).toBe('Stuff to do');
	});

	it("should load persistent Kanban", function(){
		repository.load();
		var lastUsed = repository.getLastUsed();

		expect(lastUsed.name).toBe('Stuff to do at home');
	});

	it("should inject the dependency", function(){ 
		expect(repository).not.toBe(null);
		expect(repository).not.toBe(undefined);
	});
});
