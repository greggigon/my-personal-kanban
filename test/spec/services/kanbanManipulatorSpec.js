'use strict';

describe("Kanban manipulator", function(){
	var manipulator;
	
	beforeEach(module('mpk'));
	beforeEach(inject(['kanbanManipulator', function(kanbanManipulator){
		manipulator = kanbanManipulator;
	}]));

	it('should remove card from column and add it into Archive area', function(){
		var card = new KanbanCard('Foo bar', '', '');
		var column = {"name": "Done", "cards": [card]};
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
		    column
		  ]
		};

		manipulator.archiveCard(kanban, column, card);

		expect(kanban.columns[2].cards.length).toBe(0);
		
		expect(kanban.archived.length).toBe(1);
		expect(kanban.archived[0].card).toBe(card);
		expect(kanban.archived[0].archivedOn).toBeDefined();
	});

	it('should unarchive card into last column in Kanban', function(){
		var card = new KanbanCard('Foo bar', '', '');
		var column = {"name": "Done", "cards": []};
		var archivedCard = {archivedOn: new Date(), card: card};
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
		    column
		  ],
		  "archived": [archivedCard]
		};

		manipulator.unarchiveCard(kanban, archivedCard);

		expect(column.cards.length).toBe(1);
		expect(kanban.archived.length).toBe(0);
	});

	it('should permamently delete archived card', function(){
		var card = new KanbanCard('Foo bar', '', '');
		var column = {"name": "Done", "cards": []};
		var archivedCard = {archivedOn: new Date(), card: card};
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
		    column
		  ],
		  "archived": [archivedCard]
		};
		manipulator.removeFromArchive(kanban, archivedCard);

		expect(kanban.archived.length).toBe(0);
		expect(column.cards.length).toBe(0);
	});

	it('should create new Kanban from template', function(){
		var card = new KanbanCard('Foo bar', '', '');
		var column = {"name": "Done", "cards": [card], "settings": {"color": "#111111"}};
		var archivedCard = {archivedOn: new Date(), card: card};
		
		var kanban = {
		  "name": "Stuff to do",
		  "numberOfColumns": 3,
		  "columns": [
		    {
		      "name": "Not started",
		      "cards": [
		      ],
		      "settings": {}
		    },
		    {
		      "name": "In progress",
		      "cards": [
		      ],
		      "settings": {"color": "black"}
		    },
		    column
		  ],
		  "archived": [archivedCard]
		};

		var newKanban = manipulator.createNewFromTemplate(kanban, "New awesome name");

		expect(newKanban.columns.length).toBe(3);
		expect(newKanban.name).toBe("New awesome name");
		expect(newKanban.columns[0].name).toBe("Not started");
		expect(newKanban.columns[1].settings.color).toBe("black");
		expect(newKanban.columns[2].cards.length).toBe(0);
		expect(newKanban.archived.length).toBe(0);
	});
});