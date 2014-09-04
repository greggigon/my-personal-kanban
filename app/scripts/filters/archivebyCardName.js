'use strict';

angular.module('mpk').filter('archiveByCardName', function () {
	return function (archivedCards, filterValue) {
		var filtered = [];
		var filter = filterValue || '';
		angular.forEach(archivedCards, function(archivedCard){
			if (archivedCard.card.name.toLowerCase().indexOf(filter.toLowerCase()) > -1){
				filtered.push(archivedCard);
			}
		});
		return filtered.reverse();
	};
});
