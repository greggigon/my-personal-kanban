'use strict';
function Kanban(name, numberOfColumns) {
	return {
		name: name,
		numberOfColumns: numberOfColumns,
		columns: [],
		archived: [],
		settings: {}
	};
}

function KanbanColumn(name){
	return {
		name: name,
		cards: [],
		settings: {}
	};
}

function KanbanColumn(name, settings){
	return {
		name: name,
		cards: [],
		settings: settings
	};
}

function KanbanCard(name, details, color){
	this.name = name;
	this.details = details;
	this.color = color;
	return this;
}