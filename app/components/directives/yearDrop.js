(function() {
'use strict';
angular.module('kbitsApp.components.directives')
.directive('yearDrop', function(){

  function getYears(offset, range) {
      var currentYear = new Date().getFullYear();
      console.log(currentYear);
      var years = [];
      for (var i = 0; i < range + 1; i++) {
          years.push(currentYear + offset + i);
      }
      return years;
    }
    return {
        restrict: 'AEC',
        link: function(scope,element,attrs){
            scope.years = getYears(+attrs.offset, +attrs.range);
            scope.selected = scope.years[0];
            console.log(scope.years);
        },
        template: ''
    };

});
}());
