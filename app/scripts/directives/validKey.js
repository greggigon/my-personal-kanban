'use strict';

angular.module('mpk').directive('validKey', function ($http, cloudService) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
		
        function validate() {
        	var key = element.val();
          var params = {kanbanKey: key, action: 'key'};

    			$http.jsonp(cloudService.cloudAddress + '/service/kanban?callback=JSON_CALLBACK', {params: params}).success(function(data){
    				ctrl.$setValidity('validKey', data.success);
            ctrl.$setValidity('validKeyUnableToVerify', true);
    			}).error(function(){
    				ctrl.$setValidity('validKeyUnableToVerify', false);
    			});
        };

		  scope.$watch(attrs.ngModel, validate);

      }
    };
  });
