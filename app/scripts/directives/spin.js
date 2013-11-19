'use strict';

angular.module('mpk').directive('spin', function () {
	var augmentOpts = function (color, opts) {
		if (!opts.color) {
			opts.color = color;
		}
	};
	return {
		restrict: 'A',
		transclude:true,
		replace:true,
		template: '<div ng-transclude></div>',
		scope: {
			config: '=spin',
			spinif: '=spinIf'
		},
		link: function (scope, element, attrs) {
			var cssColor = element.css('color'),
			stoped = false,
			hideElement = !!scope.config.hideElement,
			spinner;
			augmentOpts(cssColor, scope.config),
			spinner = new Spinner(scope.config),
			spinner.spin(element[0]);

			scope.$watch('config', function (newValue, oldValue) {
				if (newValue == oldValue)
					return;
				spinner.stop();
				hideElement = !!newValue.config.hideElement;
				spinner = new Spinner(newValue);
				if (!stoped)
					spinner.spin(element[0]);
			}, true);

			if (attrs.hasOwnProperty('spinIf')) {
				scope.$watch('spinif', function (newValue) {
					if (newValue) {
						spinner.spin(element[0]);
						if (hideElement) {
							element.css('display', '');
						}
						stoped = false
					} else {
						spinner.stop();
						if (hideElement) {
							element.css('display', 'none');
						}
						stoped = true
					}
				});
			}

			scope.$on('$destroy', function() {
				spinner.stop();
			});
		}
	}
});

