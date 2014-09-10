'use strict';

angular.module('mpk').directive('readFile', function(){
	return {
		restrict: 'A',
		scope: { model: '=ngModel' },
		require: 'ngModel',
		link: function(scope, element){
			element.bind('change', function(e){
				scope.readError = false;

				var file = (e.srcElement || e.target).files[0];
				var reader = new FileReader();
				
				reader.onload = function(onLoadEvent){
					scope.$apply(function(){
						scope.model = onLoadEvent.target.result;
					});
				};

				reader.readAsText(file);
			});
		}
	};
});