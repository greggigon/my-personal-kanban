'use strict';

describe("Kanban Repository", function(){

	var crypto;

	beforeEach(module('mpk'));
	beforeEach(inject(['cryptoService', function(cryptoService){
		crypto = cryptoService;
	}]));

	it("should encode and decode kanban string for the upload", function(){ 
		var beforeEncryption = '{"the awesome": [1, 2, 3], "bar": "§*%^&ø¬´®"}'
		var encrypted = crypto.encrypt(beforeEncryption, 'my-awesome-key');
		var decrypted = crypto.decrypt(encrypted, 'my-awesome-key');

		expect(decrypted).toBe(beforeEncryption);
	});
});
