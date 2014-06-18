'use strict';

describe("Cloud service", function(){

	var cloud;

	beforeEach(module('mpk'));
	beforeEach(inject(['cloudService', function(cloudService){
		cloud = cloudService;
	}]));

	it("should provide default values for local cloud settings", function(){
		var settings = cloud.loadSettings();

		expect(settings.useLocalCloud).toBeFalsy();
		expect(settings.localCloudUrl).toBeUndefined();

		expect(cloud.cloudAddress).toBe('http://localhost:8080')
	});

	it("should returned persisted values for local cloud settings", function(){
		var settings = cloud.loadSettings();
		settings.useLocalCloud = true;
		settings.localCloudUrl = 'the-awesome-url';
		cloud.saveSettings(settings);

		var loadedSettings = cloud.loadSettings();
		
		expect(settings.useLocalCloud).toBeTruthy();
		expect(settings.localCloudUrl).toBe('the-awesome-url');
		expect(cloud.cloudAddress).toBe('the-awesome-url');
	});
});
