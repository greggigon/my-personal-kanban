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
				{"name":"Done","cards":[{"name":"bar foo","color":"FCE4D4"},{"name":"Another on","color":"FCC19D"},{"name":"New one","color":"FC9AFB"}]}]}
			}, "lastUsed":"Stuff to do at home",
			"theme":"default-dark",
			"lastUpdated":1391554268110}));
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


	it("should not decrypt the kanban from Cloud that was not encrypted", function(){
		localStorage.setItem('myPersonalKanban', null);
		var jsonKanban = angular.toJson({"kanbans":{"Stuff to do at home":{"name":"Stuff to do at home","numberOfColumns":3,
			"columns":[
				{"name":"Not started","cards":[{"name":"This little piggy went to lunch","color":"CCD0FC"},{"name":"Foo bar","color":"FCE4D4"}]},
				{"name":"In progress","cards":[{"name":"another on a bit longer text this time","color":"FAFFA1"},{"name":"And another one","color":"94D6FF"}]},
				{"name":"Done","cards":[{"name":"bar foo","color":"FCE4D4"},{"name":"Another on","color":"FCC19D"},{"name":"New one","color":"FC9AFB"}]}]}
			},
			"lastUsed":"Stuff to do at home",
			"theme":"default-dark",
			"lastUpdated":1391554268110});

		repository.saveDownloadedKanban(jsonKanban, 1391554268110);
		var fromStorage = localStorage.getItem('myPersonalKanban');

		expect(fromStorage).toBe(jsonKanban);
	});

	it("should decrypt the kanban from Cloud that is decrypted", function(){
		localStorage.setItem('myPersonalKanban', null);
		var encryptedBan = 'U2FsdGVkX18bbMSeYEb7GR/k2QIII59Hdyq20etZ2Glj+ameC0DP38bf0LdHAb1lBEYPzNTZkulpFNMwDyAv7BfTdUHjli1aFHBJCuggyS8SDNJENVwo5WFyeyQo2Mf+IaB1SXa8GHkvn+TTLMA/whzyepzZrdyFsKwq2br6T+DQT11X4NSoPKgesiX/844xsav606hx/YwXhuYtiEZE2Sb4e4nUGjU1APHCS7DFXosKBExTGyUJwxJ9Tqps56VUqS1OTffFEf4ax8AA8OdhvAIveakyzY5AnVBsqtNtYn5AgUAAE0joZgQZcfIOqPl9PKwYn4tPQszVz7D0/dheTovQs2AOXMoaD/mhHUBRiBXsMIbMYPjwgDNrnDGTy0olXcI2t7Qudb8B4UQCeMVCeuOM0THLiKLdRkwaae+wZE8PaDRR+ieHk6ymvfw+9txLfA=='
		repository.saveDownloadedKanban(encryptedBan, 1391554268110);
		var fromStorage = localStorage.getItem('myPersonalKanban');
		var expectedBan = angular.toJson({"kanbans":{"Test ban":{"name":"Test ban","numberOfColumns":3,"columns":[{"name":"Column 1","cards":[{"name":"New test task","details":"§ &^$\n° ´ § ä ü ß","color":"FFFFFF"}]},{"name":"Column 2","cards":[]},{"name":"Column 3","cards":[]}]}},"lastUsed":"Test ban","theme":"default-dark","lastUpdated":1391554268110});
		expect(fromStorage).toBe(expectedBan);
	});
});
