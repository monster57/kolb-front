(function() {
    'use strict';
    angular.module('kbitsApp.controllers')
        .controller('HomeKBitsCtrl', ['MessageService', 'StartupService', '$state', '$scope', 'QueryService',
            function(MessageService, StartupService, $state, $scope, QueryService) {
                QueryService.query('GET', '/api/startup/aggregate').then(function(response) {
                    $scope.countOfRecords = response.data.data.data;
                    $scope.exampleData1 = [
                        { key: "RM", y: $scope.countOfRecords.Submit || 0},
                        { key: "SM", y: $scope.countOfRecords.Stage3 || 0 },
                        { key: "NO", y: $scope.countOfRecords.Stage4 || 0},
                        { key: "MD", y: $scope.countOfRecords.Stage5 || 0},
                        { key: "Aprd", y: $scope.countOfRecords.Approved || 0},
                        { key: "CI", y: $scope.countOfRecords.Certificate_issued || 0},
                        { key: "Reject", y: $scope.countOfRecords.Rejected }
                    ];
                    var states = ['Submit', 'Stage3', 'Stage4', 'Stage5' , "Approved"];
                    var pendingApplication = 0;
                    states.forEach(function(state) {
                        pendingApplication += $scope.countOfRecords[state]
                    })

                    $scope.application = {
                        issued: $scope.countOfRecords.Certificate_issued,
                        pending: pendingApplication,
                        lastMonth: $scope.countOfRecords.lastMonth || 0,
                        perMonth: 0
                    };
                })

                $scope.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                if ($scope.userInfo) {
                    $scope.user_websiteUrl = $scope.userInfo.website_url;
                    $scope.user_companyName = $scope.userInfo.company_name;
                }

                $scope.getStartupFormByState = function(all) {
                    var currentState = (all ? "" : StartupService.getCurrentState($scope.userInfo));
                    QueryService.query('GET', '/api/user/startup?stage=' + currentState, {}, {})
                        .then(function(response) {
                            $scope.startups = '';
                            if($scope.userInfo.type == 'Relationship' && !all){
                                $scope.startups = response.data.data.startupData.filter(function(startup){
                                    return !startup.rm_assignee;
                                })
                            }else{
                                $scope.startups = response.data.data.startupData;
                            }
                        }, function(error) {
                            console.error(error.data);
                        });
                };

                $scope.getStartupFormByAssignee = function(state) {
                    var currentState = StartupService.getCurrentState($scope.userInfo);
                    QueryService.query('GET', '/api/user/startup?stage=' + state, {}, {})
                        .then(function(response) {
                                $scope.startups = response.data.data.startupData.filter(function(startup){
                                    return startup.rm_assignee && (startup.rm_assignee.assignee_id == $scope.userInfo._id);
                                })
                        }, function(error) {
                            console.error(error.data);
                        });
                };

                $scope.getStartupFormByState();

                $scope.startupDetails = function(registrationId) {
                    $state.go('startup', { registrationId: registrationId });
                }



                $scope.xFunction = function() {
                    return function(d) {
                        return d.key;
                    };
                }
                $scope.yFunction = function() {
                    return function(d) {
                        return d.y;
                    };
                }

                $scope.goToCategory = function(category) {
                    $state.go('category', { categoryName: category });
                }
            }
        ])
})();
