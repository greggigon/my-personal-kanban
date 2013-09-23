'use strict';

angular.module('mpk').directive('sortable', function(){
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ngModel){
			if (ngModel){
				ngModel.$render = function(){
					element.sortable( 'refresh' );
				};
			}

			element.sortable({
				connectWith: attrs.sortableSelector,
				revert: true,
				remove: function(e, ui){
					if (ngModel.$modelValue.length === 1) {
						ui.item.sortable.moved = ngModel.$modelValue.splice(0, 1)[0];
					} else {
						ui.item.sortable.moved =  ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0];
					}
				},
				receive: function(e, ui){
					ui.item.sortable.relocate = true;
					ngModel.$modelValue.splice(ui.item.index(), 0, ui.item.sortable.moved);
				},
				update: function(e, ui){
					ui.item.sortable.resort = ngModel;
				},
				start: function(e, ui){
					ui.item.sortable = { index: ui.item.index(), resort: ngModel };
				},
				stop: function(e, ui){
					if (ui.item.sortable.resort && !ui.item.sortable.relocate){
						var end, start;
						start = ui.item.sortable.index;
						end = ui.item.index();

						ui.item.sortable.resort.$modelValue.splice(end, 0, ui.item.sortable.resort.$modelValue.splice(start, 1)[0]);
					}
					if (ui.item.sortable.resort || ui.item.sortable.relocate) {
						scope.$apply();
					}
				}
			});
		}
	};
});