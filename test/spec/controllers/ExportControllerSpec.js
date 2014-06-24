describe('Export controller', function(){
	var scope, fileService, modalInstance;

	beforeEach(inject(function($rootScope, $controller){
		fileService = {saveBlob: function(blob, fileName){ }};
		spyOn(fileService, 'saveBlob');

		scope = $rootScope.$new();
		modalInstance = {close: function(){}};
		kanbanRepository = {get: function(){ return {kanban: 1}}, all: function(){ return [{kanban: 1}, {kanban: 2}]}};

		exportController = $controller('ExportController', { 
			$scope: scope, 
			kanbanRepository: kanbanRepository, 
			fileService: fileService, 
			$modalInstance: modalInstance, 
			allKanbanNames: [], 
			currentKanban: ''});
	}));



	it('should export single Kanban', function(){
		scope.model.exportAll = false;
		scope.model.selectedKanban = 'foobar';

		scope.doExport();

		var expectedBlob = new Blob([angular.toJson({kanban: 1}, true)], {type: 'application/json;charset=utf-8'});
		
		expect(fileService.saveBlob).toHaveBeenCalledWith(expectedBlob, 'foobar-export.json');
	});

	it('should export all Kanbans', function(){
		scope.model.exportAll = true;

		scope.doExport();

		var expectedBlob = new Blob([angular.toJson([{kanban: 1}, {kanban: 2}], true)], {type: 'application/json;charset=utf-8'});

		expect(fileService.saveBlob).toHaveBeenCalledWith(expectedBlob, 'all-kanbans-export.json');		
	});

});