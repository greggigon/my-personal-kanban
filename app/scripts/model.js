'use strict';
function Kanban(name, numberOfColumns) {
	return {
		name: name,
		numberOfColumns: numberOfColumns,
		columns: [],
		arvhived: [],
	};
}

function KanbanColumn(name){
	return {
		name: name,
		cards: []
	};
}

function KanbanCard(name, details, color){
	this.name = name;
	this.details = details;
	this.color = color;
	return this;
}