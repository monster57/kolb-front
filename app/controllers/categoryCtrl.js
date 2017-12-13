(function () {
    'use strict';
    angular.module('kbitsApp.controllers')
        .controller("CategoryCtrl", ['MessageService', 'StartupService', '$http', '$stateParams', '$state', '$timeout', '$scope', 'QueryService',
            function (MessageService, StartupService, $http, $stateParams, $state, $timeout, $scope, QueryService) {
                $scope.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                QueryService.query('GET', '/api/user/startup?stage=' + $stateParams.categoryName, {}, {})
                    .then(function (response) {
                        $scope.categoryData = response.data.data.startupData;
                        console.log($scope.categoryData);
                    }, function (error) {
                        MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.")
                        console.error(error.data);
                    });

                $scope.startupDetails = function (registrationId) {
                    $state.go('startup', { registrationId: registrationId });
                }

            }

        ])
})();
