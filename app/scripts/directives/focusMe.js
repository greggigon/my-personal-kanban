'use strict';

angular.module('mpk').directive('focusMe', function($timeout){
	return {
		link: function(scope, element, attrs) {
			if (attrs.focusMe){
				scope.$watch(attrs.focusMe, function(value) {
					if(value === true) {
						$timeout(function() {
							element[0].focus();
						});
					}
				});
			} else {
				$timeout(function() {
					element[0].focus();
				});
			}
		}
	};
});
