(function() {
    'use strict';
    angular.module('kbitsApp.controllers')
        .controller('testCtrl', ['MessageService','$timeout', '$location', '$state', '$scope', '$rootScope', 'QueryService', 'otpService',
            function(MessageService,$timeout ,$location, $state, $scope, $rootScope, QueryService, otpService) {
                $scope.test = {};

                $scope.fileNameChanged = function(form) {

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $timeout(function() {
                            $scope.test.data = e.target.result;
                        });
                    };
                    reader.readAsDataURL(form.files[0]);
                };
            }
        ]);
}());
