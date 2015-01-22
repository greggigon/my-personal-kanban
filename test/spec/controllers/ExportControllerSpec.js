describe('Export controller', function(){
	var fileService, kanbanRepository;
	var $controller, $rootScope;
	beforeEach(module('mpk'));

	beforeEach(inject(function(_$rootScope_, _$controller_){
		fileService = {saveBlob: function(blob, fileName){ }};
		spyOn(fileService, 'saveBlob');

		$controller = _$controller_;
		$rootScope = _$rootScope_;

		kanbanRepository = {get: function(){ return {kanban: 1}}, all: function(){ return [{kanban: 1}, {kanban: 2}]}};

	}));



	it('should export single Kanban', function(){
		var scope = $rootScope.$new();
		var controller = $controller('ExportController', {$scope: scope, fileService: fileService, kanbanRepository: kanbanRepository})
		$rootScope.$broadcast('OpenExport', [], '');

		scope.model.exportAll = false;
		scope.model.selectedKanban = 'foobar';

		scope.doExport();

		var expectedBlob = new Blob([angular.toJson({kanban: 1}, true)], {type: 'application/json;charset=utf-8'});
		
		expect(fileService.saveBlob).toHaveBeenCalledWith(expectedBlob, 'foobar-export.json');
	});

	it('should export all Kanbans', function(){
		var scope = $rootScope.$new();
		var controller = $controller('ExportController', {$scope: scope, fileService: fileService, kanbanRepository: kanbanRepository})
		$rootScope.$broadcast('OpenExport', [], '');

		scope.model.exportAll = true;

		scope.doExport();

		var expectedBlob = new Blob([angular.toJson([{kanban: 1}, {kanban: 2}], true)], {type: 'application/json;charset=utf-8'});

		expect(fileService.saveBlob).toHaveBeenCalledWith(expectedBlob, 'all-kanbans-export.json');		
	});

});