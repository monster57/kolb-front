;
(function() {
    'use strict';
    angular.module('kbitsApp.controllers')

    .controller('ForgotPasswordCtrl', ['MessageService', '$stateParams' , '$state', '$scope','$location', 'QueryService',
        function(MessageService, $stateParams,$state, $scope, $location, QueryService) {
            var query = {};
            ($location.url()).split("?")[1].split("&").forEach(function(param){
                var field = param.split("=");
                query[field[0]] = field[1];
            });
            $scope.user = {};
            $scope.user.query = query;


            $scope.getPattern = function() {
                return $scope.user.password && $scope.user.password.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
            }

            $scope.savePassword = function(data){
                QueryService.query('POST', '/api/password/change', {}, data)
                        .then(function (response) {
                            var data = response.data;
                            MessageService.success(data.message);
                            $state.go('login');
                        }, function (error) {
                            MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                            console.error(error);
                        });
            }


        }
    ])
})();
