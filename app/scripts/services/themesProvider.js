'use strict';

angular.module('mpk').factory('themesProvider', function ($window) {
  var themes = $window.themes;

  return {  
    getThemes: function(){
    	return themes;
    },

    setCurrentTheme: function(theme){
		var themeStylesheet = document.getElementById('themeStylesheet');
		var pathPart = themeStylesheet.href.substr(0, themeStylesheet.href.lastIndexOf('/'));

		themeStylesheet.href = pathPart + "/" + theme + '.css';
		return themeStylesheet.href;
    }, 
    
    defaultTheme: 'default-bright',
  };

});
