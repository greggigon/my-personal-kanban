'use strict';

angular.module('mpk').filter('cardDetails', function () {
	return function (input) {
		if (input == undefined || input === '') return input;
		return input.replace(/&#10;/g, "<br />");
	};
});
