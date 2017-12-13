(function () {
    'use strict';
    angular.module('kbitsApp.controllers')
        .controller("SubmittedDetailsCtrl", ['MessageService', '$stateParams', '$state', '$timeout', '$scope', 'QueryService',
            function (MessageService, $stateParams, $state, $timeout, $scope, QueryService) {

                $scope.startupData = { comments: [] };
                $scope.userInfo = JSON.parse(localStorage.userInfo);
                var user_id = JSON.parse(localStorage.userInfo)._id;
                var startupId = $stateParams.registrationId;

                QueryService.query('GET', '/api/user/startup')
                    .then(function (response) {
                        $scope.startupData = response.data.data.startupData;
                    }, function (error) {
                        console.error(error || error.data);
                        MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                    });

                $scope.goHome = function () {

                    if (['Relationship', 'Senior', 'Nodal', 'MD'].includes(window.localStorage.getItem('AccessLevel'))) {
                        $state.go('home-kbits')
                    } else {
                        $state.go('home')
                    }
                }
                $scope.showFile = function (id) {
                    QueryService.query('GET', '/api/startup/document?id=' + id, {}, {})
                        .then(function (response) {
                            window.open(response.data.data.data.data, '_blank');
                        }, function (error) {
                            console.error(error && error.data);
                        });

                }
                $scope.downloadPDF = function (id) {
                    QueryService.query('GET', '/api/startup/document?id=' + id, {}, {})
                        .then(function (response) {
                            var link = document.createElement("a");
                            link.setAttribute("href", response.data.data.data.data);
                            link.setAttribute("download", response.data.data.data.name);
                            document.body.appendChild(link);
                            link.click();
                        })
                }


            }
        ])

})();
