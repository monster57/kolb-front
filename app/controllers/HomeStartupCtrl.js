(function() {
    'use strict';
    angular.module('kbitsApp.controllers')
        .controller('HomeStartupCtrl', ['StartupService', '$state', '$scope', '$sce', '$templateCache',
            '$compile', 'QueryService', '$timeout',
            function(StartupService, $state, $scope, $sce, $templateCache, $compile, QueryService, $timeout) {
                $scope.userName = window.localStorage.getItem('UserName');
                $scope.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                $scope.userBasicDetails = {};
                StartupService.initVariables($scope);
                $scope.submitStartup = function(id) {
                    //  $state.go('submit-details');
                    $state.transitionTo('submit-details', { id: id });
                };

                QueryService.query('GET', '/api/user/startup', {}, {})
                    .then(function(res) {
                        var startup = res.data.data.startupData;
                        /**
                         * init the data using the StartupService
                         */
                        if (startup.stage && startup.stage.length) {
                            StartupService.assignData($scope, startup);
                            $scope.isSubmitted = startup.is_submitted;
                            $scope.reason_for_rejection = startup.reason_for_rejection;
                            $scope.reason_for_send_to_user = startup.reason_for_send_to_user;
                            $scope.stage = startup.stage[startup.stage.length - 1].contentType;

                            if (["Draft" , "UserAction"].indexOf($scope.stage) >= 0) {
                                $scope.status = "Draft"
                            } else
                            if (["Submit", "Stage3", "Stage4" , "Stage5" , "Approved"].indexOf($scope.stage) >= 0) {
                                $scope.status = "In Process"
                            } else if (["Certificate_issued"].indexOf($scope.stage) >= 0) {
                                $scope.status = "Approved"
                            } else if ($scope.isSubmitted) {
                                $scope.status = "Submit"
                            } else if (["Rejected"].indexOf($scope.stage) >= 0) {
                                $scope.status = "Rejected"
                            }else {
                                $scope.stage = "Welcome"
                            }
                        }

                    }, function(error) {
                        $state.go("login")
                    });

                /**
                 * Download the certificate
                 */
                // $scope.downloadCertificate = function() {
                //     var doc = new jsPDF();
                //     var specialElementHandlers = {
                //         '#editor': function(element, renderer) {
                //             return true;
                //         }
                //     };

                //     doc.fromHTML('/images/certificate.html', 15, 15, {
                //         'width': 170,
                //         'elementHandlers': specialElementHandlers
                //     });
                //     doc.save('certificate.pdf');

                // };

                /**
                 * Logo Controller
                 */
                ////// Image show /////
                $scope.onUpload = function(form, field) {
                    ($scope[field]) ? "" : ($scope[field] = []);
                    StartupService.fileUpload(form, $scope[field]);
                };

                $scope.saveBasicDetails = StartupService.saveBasicDetails.bind(null,$scope);

                // $scope.certificate=$sce.trustAsHtml($templateCache.get("/kbitsApp/views/home/certificate.html"));

            }
        ])

})();
