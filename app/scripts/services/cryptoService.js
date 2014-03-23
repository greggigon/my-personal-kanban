'use strict';

angular.module('mpk').factory('cryptoService', function () {
    return {
    	md5Hash : function(stringToHash){
    		return CryptoJS.MD5(stringToHash).toString();
    	},

    	encrypt: function(stringToEncrypt, encryptionKey){
    		var utfEncoded = CryptoJS.enc.Utf8.parse(stringToEncrypt);
    		return CryptoJS.Rabbit.encrypt(utfEncoded, encryptionKey).toString();
    	},

    	decrypt: function(stringToDecrypt, encryptionKey){
    		var notYetUtf8 = CryptoJS.Rabbit.decrypt(stringToDecrypt, encryptionKey);
    		return CryptoJS.enc.Utf8.stringify(notYetUtf8);
    	}
    };
});
