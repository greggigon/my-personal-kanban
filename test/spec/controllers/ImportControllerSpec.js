describe('Import controller', function(){
	var scope, modalInstance, kanbanRepository, window;

	beforeEach(inject(function($rootScope, $controller){
		scope = $rootScope.$new();
		modalInstance = {close: function(){}};
		kanbanRepository = {import: function(kanbans){}};
		spyOn(kanbanRepository, 'import');

		importController = $controller('ImportController', { 
			$scope: scope, 
			$modalInstance: modalInstance,
			kanbanRepository: kanbanRepository
		});
	}));



	it('should set reading error if file content is not JSON object', function(){
		scope.model.file = 'ksjfalksjdflajs dasdj alsdkj';

		expect(scope.model.readError).toBeFalsy();

		scope.import();

		expect(scope.model.readError).toBeTruthy();
	});

	it('should import single Kanban and switch last used to it', function(){
		scope.model.file = {"name":"foo", "numberOfColumns":3, "columns": [{"name": "Col 1", "cards": []},{"name": "Col 1", "cards": []},{"name": "Col 1", "cards": []}]};
		
		scope.import();

		expect(kanbanRepository.import).toHaveBeenCalledWith({"foo": scope.model.file});
	});

	it('should import multiple Kanbans and switch last used to first from the list', function(){
		scope.model.file = {"foo": {"name":"foo", "numberOfColumns":3, "columns": [{"name": "Col 1", "cards": []},{"name": "Col 1", "cards": []},{"name": "Col 1", "cards": []}]}};
		
		scope.import();

		expect(kanbanRepository.import).toHaveBeenCalledWith(scope.model.file);
	});

});