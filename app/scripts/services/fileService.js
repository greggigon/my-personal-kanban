'use strict';

angular.module('mpk').factory('fileService', function () {
	return {
		saveBlob: function(blob, fileName){
			return saveAs(blob, fileName);
		}
	};
});
