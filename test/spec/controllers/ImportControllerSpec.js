describe('Import controller', function(){
	beforeEach(module('mpk'));
	
	var scope, kanbanRepository, window;
	var importController;
	var _$rootScope_, _$controller_;


	beforeEach(inject(function(_$rootScope_, _$controller_){
		$rootScope = _$rootScope_;
		$controller = _$controller_;

		scope = $rootScope.$new();
		kanbanRepository = {import: function(kanbans){}};
		spyOn(kanbanRepository, 'import');

		importController = $controller('ImportController', { 
			$scope: scope, 
			kanbanRepository: kanbanRepository
		});
	}));



	it('should set reading error if file content is not JSON object', function(){
		$rootScope.$broadcast('OpenImport');

		scope.model.file = 'ksjfalksjdflajs dasdj alsdkj';

		expect(scope.model.readError).toBeFalsy();

		scope.import();

		expect(scope.model.readError).toBeTruthy();
	});

	it('should import single Kanban and switch last used to it', function(){
		$rootScope.$broadcast('OpenImport');

		scope.model.file = {"name":"foo", "numberOfColumns":3, "columns": [{"name": "Col 1", "cards": []},{"name": "Col 1", "cards": []},{"name": "Col 1", "cards": []}]};
		
		scope.import();

		expect(kanbanRepository.import).toHaveBeenCalledWith({"foo": scope.model.file});
	});

	it('should import multiple Kanbans and switch last used to first from the list', function(){
		$rootScope.$broadcast('OpenImport');

		scope.model.file = {"foo": {"name":"foo", "numberOfColumns":3, "columns": [{"name": "Col 1", "cards": []},{"name": "Col 1", "cards": []},{"name": "Col 1", "cards": []}]}};
		
		scope.import();

		expect(kanbanRepository.import).toHaveBeenCalledWith(scope.model.file);
	});

});