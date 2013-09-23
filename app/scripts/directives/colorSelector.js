'use strict';

angular.module('mpk').directive('colorSelector', function(){
	return {
		restrict: 'E',
		scope: { options: '=', model: '=ngModel', prefix: '@', showRadios: '=', showHexCode: '='},
		require: 'ngModel',
		template: '<span ng-show="showHexCode">&nbsp;#{{model}}</span><div class="pull-left" ng-repeat="option in options" ng-model="option">\n'+
				'	<label class="colorBox" for="{{prefix}}{{option}}" ng-class="{selected: option == model}" style="background-color: #{{option}};" ng-click="selectColor(option)"></label>\n'+
                '	<br ng-show="showRadios"/>\n'+
                '	<input type="radio" id="{{prefix}}{{option}}" name="{{prefix}}" value="{{option}}" ng-show="showRadios" ng-model="model"/>\n'+
                '</div>\n',
        link: function(scope) {
            if (scope.model === undefined || scope.model === ''){
                scope.model = scope.options[0];
            }

            scope.selectColor = function(color){
                scope.model = color;
            };
        }
	};
});