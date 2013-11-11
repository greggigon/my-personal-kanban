'use strict';

angular.module('mpk').factory('cryptoService', function () {
    return {
    	md5Hash : function(stringToHash){
    		return CryptoJS.MD5(stringToHash).toString();
    	},
    };
});
