'use strict';
var ApplicationController = function ($scope, $window, kanbanRepository, themesProvider) {
	$scope.colorOptions = ['FFFFFF','DBDBDB','FFB5B5', 'FF9E9E', 'FCC7FC', 'FC9AFB', 'CCD0FC', '989FFA', 'CFFAFC', '9EFAFF', '94D6FF','C1F7C2', 'A2FCA3', 'FAFCD2', 'FAFFA1', 'FCE4D4', 'FCC19D'];

	// <-------- Handling different events in this block ---------------> //
	$scope.$on('ChangeCurrentKanban', function(){
		$scope.kanban = kanbanRepository.getLastUsed();
		$scope.allKanbans = Object.keys(kanbanRepository.all());
		$scope.selectedToOpen = $scope.kanban.name;
	});

	$scope.$on('Open', function(event, args){
		$scope.kanban = kanbanRepository.get(args.kanbanName);

		kanbanRepository.setLastUsed(args.kanbanName);
		kanbanRepository.save();
	});

	$scope.$on('KanbanDeleted', function(){
		$scope.kanban = undefined;
		$scope.allKanbans = Object.keys(kanbanRepository.all());
	});

	$scope.$on('UploadStarted', function(){
		$scope.errorMessage = '';
		$scope.showError = false;
		$scope.infoMessage = 'Uploading Kanban ...';
		$scope.showInfo = true;
		$scope.showSpinner = true;
	});

	$scope.$on('UploadFinished', function(){
		$scope.infoMessage = '';
		$scope.showInfo = false;
		$scope.showSpinner = false;
	});

	$scope.$on('UploadError', function(){
		$scope.infoMessage = '';
		$scope.showInfo = true;
		$scope.showSpinner = false;
		$scope.showError = true;
		$scope.errorMessage = 'There was a problem uploading your Kanban.';
	});

	$scope.$on('DownloadStarted', function(){
		$scope.infoMessage = 'Downloading your Kanban ...';
		$scope.showSpinner = true;
		$scope.showError = false;
		$scope.errorMessage = '';
	});

	$scope.$on('DownloadFinished', function(){
		$window.location.reload();
	});

	$scope.$on('DownloadFinishedWithError', function(event, error){
		$scope.infoMessage = '';
		$scope.showInfo = true;
		$scope.showError = true;
		$scope.showSpinner = false;
		$scope.errorMessage = error;
	});

	$scope.$on('DownloadError', function(){
		$scope.infoMessage = '';
		$scope.showInfo = true;
		$scope.showError = true;
		$scope.showSpinner = false;
		$scope.errorMessage = 'Problem Downloading your Kanban. Check Internet connectivity and try again.';
	});
	
	// <-------- Handling different events in this block ---------------> //
	$scope.spinConfig = {lines: 10, length: 3, width: 2, radius:5};

	var currentKanban = new Kanban('Kanban name', 0);
	var loadedRepo = kanbanRepository.load();

	if (loadedRepo && kanbanRepository.getLastUsed() != undefined	) {
		currentKanban = kanbanRepository.getLastUsed();
	}

	$scope.kanban = currentKanban;
	$scope.allKanbans = Object.keys(kanbanRepository.all());
	$scope.selectedToOpen = currentKanban.name;

	$scope.$watch('kanban', function(){
		kanbanRepository.save();
	}, true);

	var windowHeight = angular.element($window).height() - 180;
	$scope.minHeightOfColumn =  'min-height:'+windowHeight+'px;';

	$scope.triggerOpen = function(){
		$scope.$broadcast('TriggerOpenKanban');
	};

	if (kanbanRepository.getTheme() != undefined && kanbanRepository.getTheme() != ''){
		themesProvider.setCurrentTheme(kanbanRepository.getTheme());
	}

};
