;
(function () {
    'use strict';
    angular.module('kbitsApp.controllers')

        .controller('registerCtrl', ['MessageService', '$state', '$scope', 'QueryService',
            function (MessageService, $state, $scope, QueryService) {

                $scope.tab = 1;
                $scope.setTab = function (newTab) {
                    $scope.tab = newTab;
                };

                $scope.userTypes = {
                    disabled:'Startup',
                    selected:'Startup',
                    types:["Incubator","Institute","Investor","Mentor","User","Startup","Other"]
                };

                $scope.isSet = function (tabNum) {
                    return $scope.tab === tabNum;
                };

                $scope.submitAdd = function (user) {
                    QueryService.query('POST', '/api/signup', {}, user)
                        .then(function (response) {
                            var data = response.data;
                            MessageService.success('You have successfully registered. Please verify your email');
                            $state.go('login');
                        }, function (error) {
                            console.error(error && error.data);
                        });
                };
                ///// For switch buttons /////
                $scope.data = {
                    cb1: "No",
                    cb2: "No",
                    cb3: "No",
                    cb4: "No"
                };

                $scope.message = 'false';
                $scope.self_cerfication = 'No'

                $scope.onChange = function (cbState) {
                    $scope.message = cbState;
                };

                $scope.user = {
                    password: '',
                    confirm_password: ''
                }

                $scope.getPattern = function () {
                    return $scope.user.password && $scope.user.password.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
                }
            }
        ])


})()
