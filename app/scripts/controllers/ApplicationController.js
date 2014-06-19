'use strict';
var ApplicationController = function ($scope, $window, kanbanRepository, themesProvider) {
	$scope.colorOptions = ['FFFFFF','DBDBDB','FFB5B5', 'FF9E9E', 'FCC7FC', 'FC9AFB', 'CCD0FC', '989FFA', 'CFFAFC', '9EFAFF', '94D6FF','C1F7C2', 'A2FCA3', 'FAFCD2', 'FAFFA1', 'FCE4D4', 'FCC19D'];

	// <-------- Handling different events in this block ---------------> //
	$scope.$on('NewKanbanAdded', function(){
		$scope.kanban = kanbanRepository.getLastUsed();
		$scope.allKanbans = Object.keys(kanbanRepository.all());
		$scope.selectedToOpen = $scope.kanban.name;
	});

	function openKanban(event, args){
		$scope.kanban = kanbanRepository.get(args.kanbanName);

		kanbanRepository.setLastUsed(args.kanbanName);
		$scope.newName = args.kanbanName;
		kanbanRepository.save();
	}

	$scope.$on('Open', openKanban);

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

	function handleErrorUploadDownload(event, errorMessage){
		$scope.infoMessage = '';
		$scope.showInfo = true;
		$scope.showError = true;
		$scope.showSpinner = false;
		$scope.errorMessage = errorMessage;
	}

	$scope.$on('UploadFinishedWithErrors', handleErrorUploadDownload);

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

	$scope.$on('DownloadFinishedWithError', handleErrorUploadDownload);

	$scope.$on('DownloadError', function(){
		$scope.infoMessage = '';
		$scope.showInfo = true;
		$scope.showError = true;
		$scope.showSpinner = false;
		$scope.errorMessage = 'Problem Downloading your Kanban. Check Internet connectivity and try again.';
	});

	$scope.editingKanbanName = function(){
		$scope.editingName = true;
	};

	$scope.editingName = false;
	
	$scope.rename = function(){
		kanbanRepository.renameLastUsedTo($scope.newName);
		kanbanRepository.save();
		$scope.allKanbans = Object.keys(kanbanRepository.all());
		$scope.editingName = false;
	};

	$scope.openKanbanShortcut = function($event){
		$scope.$broadcast('TriggerOpen');
	};

	$scope.switchToKanban = function(kanbanName){
		openKanban(null, {kanbanName: kanbanName});
	};
	
	// <-------- Handling different events in this block ---------------> //
	$scope.spinConfig = {lines: 10, length: 3, width: 2, radius:5};

	var currentKanban = new Kanban('Kanban name', 0);
	var loadedRepo = kanbanRepository.load();

	if (loadedRepo && kanbanRepository.getLastUsed() != undefined	) {
		currentKanban = kanbanRepository.getLastUsed();
	}

	$scope.kanban = currentKanban;
	$scope.allKanbans = Object.keys(kanbanRepository.all());
	$scope.selectedToOpen = $scope.newName = currentKanban.name;

	$scope.switchToList = $scope.allKanbans.slice(0);
	$scope.switchToList.splice(0, 0, 'Switch to ...');
	$scope.switchTo = 'Switch to ...';

	$scope.$watch('kanban', function(){
		kanbanRepository.save();
	}, true);

	var windowHeight = angular.element($window).height() - 110;
	$scope.minHeightOfColumn =  'min-height:'+windowHeight+'px;';

	$scope.triggerOpen = function(){
		$scope.$broadcast('TriggerOpenKanban');
	};

	if (kanbanRepository.getTheme() != undefined && kanbanRepository.getTheme() != ''){
		themesProvider.setCurrentTheme(kanbanRepository.getTheme());
	}

};
