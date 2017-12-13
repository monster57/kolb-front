angular
  .module('kbitsApp.components.directives')
  .directive('logout', function() {
    return function(scope, element) {
    //  $scope.$watch(userlogged, function(newVal, oldVal();

      element.find('navbar-nav').on('click', function(e) {
        var link = $(e.currentTarget);

        // make the current li have the active class and remove it from others
        link
          .parent('li')
          .addClass('active')
          .siblings('li')
          .removeClass('hidden');

        // hide all content divs
        element.find('.logout').addClass('hidden');

        // show the one content div I want
        $(link.attr('href')).removeClass('hidden');

        e.preventDefault();
      });
    };
  });
