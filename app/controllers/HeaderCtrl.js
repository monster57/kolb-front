'use strict';
angular.module('kbitsApp.controllers')
    .controller('HeaderCtrl', ['MessageService', 'StartupService', '$state', '$scope', 'QueryService',
        function(MessageService, StartupService, $state, $scope, QueryService, $timeout) {
            $scope.userName = window.localStorage.getItem('UserName');
            $scope.logout = function() {
                QueryService.query('GET', '/api/logout', {}, {}).then(function(response) {
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                    $state.go('login');
                    MessageService.success('You have successfully logged out');
                    $state.go("login");
                }, function(error) {
                    console.error(error && error.data);
                    MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.")

                })


            }

            $scope.goHome = function() {

                if (['Relationship', 'Senior', 'Nodal', 'MD'].includes(window.localStorage.getItem('AccessLevel'))) {
                    $state.go('home-kbits')
                } else {
                    $state.go('home')
                }
            }

            if (!window.localStorage.getItem("UserName")) {
                $state.go('login');

            }


        }
    ]);
