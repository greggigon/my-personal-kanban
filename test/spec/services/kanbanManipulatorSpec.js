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

	it('should delete column from Kanbana', function(){
		var card = new KanbanCard('Foo bar', '', '');
		var column1 = new KanbanColumn("Column");
		var column2 = new KanbanColumn("Column");
		column2.cards = [card];
		
		var kanban = new Kanban('foobar', 2);
		kanban.columns = [column1, column2];

		manipulator.removeColumn(kanban, column2);

		expect(kanban.numberOfColumns).toBe(1);
		expect(kanban.columns.length).toBe(1);
		expect(kanban.columns[0].cards.length).toBe(0);
	});

	it('should add column at specific position', function(){
		var card = new KanbanCard('Foo bar', '', '');
		var column1 = new KanbanColumn("Column 1");
		var column2 = new KanbanColumn("Column 2");
		var kanban = new Kanban('foobar', 2);
		kanban.columns = [column1, column2];

		manipulator.addColumnNextToColumn(kanban, column1, 'left');
		expect(kanban.columns.length).toBe(3);
		expect(kanban.columns[0].name).toBe('New column 3');
		expect(kanban.numberOfColumns).toBe(3);

		manipulator.addColumnNextToColumn(kanban, column1, 'right');
		expect(kanban.columns.length).toBe(4);
		expect(kanban.columns[2].name).toBe('New column 4');
		expect(kanban.numberOfColumns).toBe(4);

		manipulator.addColumnNextToColumn(kanban, column2, 'right');
		expect(kanban.columns.length).toBe(5);
		expect(kanban.columns[4].name).toBe('New column 5');
		expect(kanban.numberOfColumns).toBe(5);
	});
});