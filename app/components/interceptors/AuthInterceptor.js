/**
 * Auth interceptor for HTTP and Socket request. This interceptor will add required
 * JWT (Json Web Token) token to each requests. That token is validated in server side
 * application.
 *
 * @see http://angular-tips.com/blog/2014/05/json-web-tokens-introduction/
 * @see http://angular-tips.com/blog/2014/05/json-web-tokens-examples/
 */
(function() {
    'use strict';

    /**
     * You can intercept any request or response inside authInterceptor
     * or handle what should happend on 40x, 50x errors
     *
     */
    angular
        .module('kbitsApp.components.interceptors')
        .factory('AuthInterceptor', authInterceptor);

    authInterceptor.$inject = ['$rootScope', '$q', 'LocalStorage', '$location'];

    function authInterceptor($rootScope, $q, LocalStorage, $location) {

        return {

            // intercept every request
            request: function requestCallback(config) {
                var token;

                // Yeah we have some user data on local storage
                if (window.localStorage.getItem('token')) {
                    token = window.localStorage.getItem('token');
                }
                //console.log(token);
                // Yeah we have a token
                if (token) {
                    if (!config.data) {
                        config.data = {};
                    }

                    /**
                     * Set token to actual data and headers. Note that we need bot ways because of socket cannot modify
                     * headers anyway. These values are cleaned up in backend side policy (middleware).
                     */
                    config.data.token = token;
                    config.headers.authorization = 'Bearer ' + token;
                }

                return config;
            },


            // Catch 404 errors
            responseError: function responseErrorCallback(response) {
                if (response.status === 401) {
                    response.statusText = "The email address or password you entered is incorrect."
                };
                return $q.reject(response);
            }
        };
    }


}());
