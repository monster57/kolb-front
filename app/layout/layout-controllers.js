/**
 * This file contains all necessary Angular controller definitions for 'frontend.core.layout' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  /**
   * Generic header controller for application layout. this contains all necessary logic which is used on application
   * header section. Basically this contains following:
   *
   *  1) Main navigation
   *  2) Login / Logout
   *  3) Profile
   */
  angular.module('kbitsApp.layout')
    .controller('HeaderController', [
      '$scope', '$state','$rootScope',
      // 'HeaderNavigationItems',
      //'UserService',
        'AuthService',
      function controller(
        $scope, $state, $rootScope,
        // HeaderNavigationItems,
        AuthService

      ) {
        // $scope.user = UserService.user;
        // $scope.auth = AuthService;
        // $scope.navigationItems = HeaderNavigationItems;
        //$scope.stateIdentifier = $state.current.name;

        $scope.feedback = function(){
          var stateIdentifier = $state.current.name;
          var screen_title = $state.current.data.screen_title;
          $state.go('feedback',{stateIdentifier:stateIdentifier,'screen_title':screen_title});
        }

        $scope.userName = window.localStorage.getItem('userName');
        $scope.userId = window.localStorage.getItem('personId');
         $rootScope.loginId = window.localStorage.getItem('personId');
        /**
         * Helper function to determine if menu item needs 'not-active' class or not. This is basically
         * special case because of 'examples.about' state.
         *
         * @param   {layout.menuItem}   item    Menu item object
         *
         * @returns {boolean}
         */
        $scope.isNotActive = function isNotActive() {
          //return !!(item.state === 'screens' && $state.current.name === 'screens.about');
          return $state.is("fpoSelect");
        };

        /**
         * Helper function to determine if specified menu item needs 'active' class or not. This is needed
         * because of reload of page, in this case top level navigation items are not activated without
         * this helper.
         *
         * @param   {layout.menuItem}   item    Menu item object
         *
         * @returns {boolean}
         */
        $scope.isActive = function isActive(item) {
          var bits = $state.current.name.toString().split('.');

          return !!(
            (item.state === $state.current.name) ||
            (item.state === bits[0] && $state.current.name !== 'examples.about')
          );
        };

        // Simple helper function which triggers user logout action.
        $scope.logout = function logout() {
                  localStorage.clear();
                    $state.go("login");
              };
      }
    ])
  ;

  /**
   * Generic footer controller for application layout. This contains all necessary logic which is used on application
   * footer section. Basically this contains following:
   *
   *  1) Generic links
   *  2) Version info parsing (back- and frontend)
   */
  angular.module('kbitsApp.layout')
    .controller('FooterController', ['$scope','$state','$rootScope',
      function controller($scope,$state,$rootScope) {
        // TODO: add version info parsing
        $scope.info = ' EQTribe.com ';

        $scope.feedback = function(){
          var stateIdentifier = $state.current.name;
          var screen_title = $state.current.data.screen_title;
          $state.go('feedback',{stateIdentifier:stateIdentifier,'screen_title':screen_title});
        }

  }]);

  /**
   * Generic navigation controller for application layout. This contains all necessary logic for pages sub-navigation
   * section. Basically this handles following:
   *
   *  1) Sub navigation of the page
   *  2) Opening of information modal
   */
  angular.module('kbitsApp.layout')
    .controller('NavigationController', [
      '$scope', '$state', '$modal',
      '_items',
      function controller(
        $scope, $state, $modal,
        _items
      ) {
        $scope.navigationItems = _items;

        // Helper function to open information modal about current GUI.
        $scope.openInformation = function openInformation() {
          $modal.open({
            templateUrl: '/layout/partials/help.html',
            controller: 'NavigationModalController',
            size: 'lg',
            resolve: {
              '_title': function resolve() {
                return $state.current.name.toString();
              },
              '_files': [
                'NavigationInfoModalFiles',
                function resolve(NavigationInfoModalFiles) {
                  return NavigationInfoModalFiles.get($state.current.name.toString());
                }
              ],
              '_template': function resolve() {
                return $state.current.views['content@'].templateUrl.replace('.html', '-info.html');
              }
            }
          });
        };
      }
    ])
  ;

  /**
   * Controller for navigation info modal. This is used to show GUI specified detailed information about how those
   * are done (links to sources + generic information / description).
   */
  angular.module('kbitsApp.layout')
    .controller('NavigationModalController', [
      '$scope', '$modalInstance',
      'BackendConfig',
      '_title', '_files', '_template',
      function(
        $scope, $modalInstance,
        BackendConfig,
        _title, _files, _template
      ) {
        $scope.title = _title;
        $scope.files = _files;
        $scope.template = _template;
        $scope.backendConfig = BackendConfig;

        // Dismiss function for modal
        $scope.dismiss = function dismiss() {
          $modalInstance.dismiss();
        };
      }
    ])
  ;
}());
