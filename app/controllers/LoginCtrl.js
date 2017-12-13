;
(function() {
    'use strict';
    angular.module('kbitsApp.controllers')

    .controller('loginCtrl', ['MessageService', '$location', '$state', '$scope', '$rootScope', 'QueryService', 'otpService',
        function(MessageService, $location, $state, $scope, $rootScope, QueryService, otpService) {
            $scope.user = {};
            $scope.forgotPassword = {
                status: false
            };
            if (localStorage.userInfo) {
                if (['Relationship', 'Senior', 'Nodal', 'MD'].includes(JSON.parse(localStorage.userInfo).type)) {
                    $state.go('home-kbits')
                } else {
                    $state.go('home')
                }
            }
            $scope.login = function() {
                QueryService.query('POST', '/api/login', {}, $scope.user)
                    .then(function(response) {
                        if (response && response.data) {
                            var AccessLevel = response.data.data.user.type;
                            $scope.userInfo = response.data.data.user;
                            localStorage.setItem('userInfo', JSON.stringify($scope.userInfo))
                            localStorage.setItem('AccessLevel', response.data.data.user.type)
                            $scope.UserName = $scope.userInfo.first_name + " " + $scope.userInfo.last_name;
                            localStorage.setItem('UserName', $scope.UserName)
                            // MessageService.success('You have successfully logged in');
                            if (['Relationship', 'Senior', 'Nodal', 'MD'].includes(AccessLevel)) {
                                $state.go('home-kbits')
                            } else {
                                $state.go('home')
                            }
                        } else {
                            $state.go('login')
                        }
                    }, function(error) {
                        console.error(error);
                        // MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                    });
            };

            $scope.userRegister = function userRegister() {
                $state.go('newRegister');
            };

            $scope.showForgotPasswordBlock = function() {
                $scope.forgotPassword.status = true;
            }

            $scope.getPattern = function() {
                return $scope.forgotPassword.password && $scope.forgotPassword.password.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
            }
            // $scope.sendRecoveryMail = function(data) {

            //     QueryService.query('POST', '/api/password/change', {}, data)
            //         .then(function(response) {
            //             $scope.forgotPassword.status = false;
            //             var data = response.data;
            //             MessageService.success(data.message);
            //         }, function(error) {
            //             console.error(error && error.data);
            //             MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
            //         });
            // }
            $scope.sendRecoveryMail = function(data) {
                QueryService.query('POST', '/api/password/forgot', {}, data)
                    .then(function(response) {
                        $scope.forgotPassword.status = false;
                        var data = response.data;
                        MessageService.success(data.message);
                    }, function(error) {
                        console.error(error && error.data);
                        MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                    });
            }

        }
    ]);


}());
