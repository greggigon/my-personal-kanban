'use strict';

angular.module('mpk').filter('cardDetails', function () {
	return function (input) {
		console.log(input);
		return input.replace(/&#10;/g, "<br />");
	};
});
