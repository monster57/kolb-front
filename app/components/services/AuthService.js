(function() {
  'use strict';

  angular.module('kbitsApp.components.services')
    .factory('AuthService', [
      '$http', '$state', 'CONSTANTS',
      function factory(
        $http, $state, CONSTANTS
      ) {
        return {
          /**
           * Method to authorize current user with given access level in application.
           *
           * @param   {Number}    accessLevel Access level to check
           *
           * @returns {Boolean}
           */
          authorize: function authorize(accessLevel) {
            if (accessLevel === CONSTANTS.AccessLevels.user) {
              return this.isAuthenticated();
            } else if (accessLevel === CONSTANTS.AccessLevels.admin) {
              return this.isAuthenticated() && (localStorage.admin_status === 'ADMIN');
            } else {
              return accessLevel === CONSTANTS.AccessLevels.anon;
            }
          },

          /**
           * Method to check if current user is authenticated or not. This will just
           * simply call 'Storage' service 'get' method and returns it results.
           *
           * @returns {Boolean}
           */
          isAuthenticated: function isAuthenticated() {
            return Boolean(localStorage.token);
          }

        };
      }
    ])
  ;
}());
