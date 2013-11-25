'use strict';

angular.module('mpk').directive('validKey', function ($http) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
		
        function validate() {
        	var key = element.val();
			var params = {kanbanKey: key, action: 'get'};

			$http.jsonp('http://localhost:8080/service/kanban?callback=JSON_CALLBACK', {params: params}).success(function(data){
				ctrl.$setValidity('validKey', data.success)
			}).error(function(){
				ctrl.$setValidity('validKeyUnableToVerify', false);
			});
        };

		scope.$watch(attrs.ngModel, validate);

      }
    };
  });
