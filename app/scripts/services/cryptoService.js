'use strict';

angular.module('mpk').factory('cryptoService', function () {
    return {
        encryptionKey : 'my-random-key',

    	md5Hash : function(stringToHash){
    		return CryptoJS.MD5(stringToHash).toString();
    	},

    	encrypt: function(stringToEncrypt){
    		var utfEncoded = CryptoJS.enc.Utf8.parse(stringToEncrypt);
    		return CryptoJS.Rabbit.encrypt(utfEncoded, this.encryptionKey).toString();
    	},

    	decrypt: function(stringToDecrypt){
    		var notYetUtf8 = CryptoJS.Rabbit.decrypt(stringToDecrypt, this.encryptionKey);
    		return CryptoJS.enc.Utf8.stringify(notYetUtf8);
    	}
    };
});
