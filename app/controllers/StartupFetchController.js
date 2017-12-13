(function () {
    'use strict';
    angular.module('kbitsApp.controllers')
        .controller("StartupFetchCtrl", ['$filter', 'CONSTANTS', '$sce', 'MessageService', 'StartupService', '$http', '$stateParams', '$state', '$timeout', '$scope', 'QueryService', '$window', '$mdDialog', '$mdMedia',
            function ($filter, CONSTANTS, $sce, MessageService, StartupService, $http, $stateParams, $state, $timeout, $scope, QueryService, $window, $mdDialog, $mdMedia) {

                $scope.startupData = { comments: [] };
                $scope.userInfo = JSON.parse(localStorage.userInfo);
                var user_id = $scope.userInfo._id;
                var startupId = $stateParams.registrationId;
                $scope.zipped_file = CONSTANTS.API_URL + "/api/startup/zipped_docs?registration_id=" + startupId;

                QueryService.query('GET', '/api/startup/' + $stateParams.registrationId, {}, {})
                    .then(function (response) {
                        $scope.startupData = response.data.data.startupData;
                        var rmChecklist = {
                            listItems: [{
                                "name": "Company Name",
                                "helpText": "(Should match the COI)",
                                "id": 1,
                                "value": $scope.startupData.basic_details.name,
                                "verified": false,
                                "againstDocument": "582d42511abff63106dc97a0",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Date of Incorporation ",
                                "helpText": "(Should match the COI)",
                                "id": 2,
                                "value": ($scope.startupData.company_records && $scope.startupData.company_records.incorporation_date) ? $scope.startupData.company_records.incorporation_date = $filter('date')($scope.startupData.company_records.incorporation_date, 'dd/MM/yyyy') : "Not added",
                                "verified": false,
                                "againstDocument": "582d42ec1abff63106dc97a9",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Startup under four years ",
                                "helpText": "(Should be less than 4 years as per COI)",
                                "id": 3,
                                "value": ($scope.startupData.company_records && $scope.startupData.company_records.incorporation_date) ? $scope.startupData.company_records.incorporation_date = $filter('date')($scope.startupData.company_records.incorporation_date, 'dd/MM/yyyy') : "Not added",
                                "verified": false,
                                "againstDocument": "582d42ec1abff63106dc97a9",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Location",
                                "helpText": "(Should match the COI)",
                                "id": 4,
                                "value": $scope.startupData.detailed_background.address,
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Technology Justification ",
                                "helpText": "(Should be satisfactory)",
                                "id": 5,
                                "value": $scope.startupData.technology_usage.area_of_operation,
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Employment ",
                                "helpText": "(50% within Karnataka)",
                                "id": 6,
                                "value": $scope.startupData.emp_info.no_of_permanent_emp + '/' + $scope.startupData.emp_info.no_of_permanent_qualified_workforce,
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Revenue ",
                                "helpText": "(Under 50Cr as per the financial statements)",
                                "id": 7,
                                "value": ($scope.startupData.financial_information.indicators[0] && $scope.startupData.financial_information.indicators[0].revenue) == 0 ? $scope.startupData.financial_information.indicators[0].revenue : "Not Applicable",
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Self Declaration",
                                "helpText": "(Provided by the company on their letterhead as per the format - Annexure1)",
                                "id": 8,
                                "value": ($scope.startupData.annexure[0] && $scope.startupData.annexure[0].name == false) ? "Annexure1 Uploaded: " + $scope.startupData.annexure[0].name : "Not Uploaded",
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Incubator Endorsement ",
                                "helpText": "(If incubated, should provide incubator endorsement)",
                                "id": 9,
                                "value": $scope.startupData.incubator_details.is_incubated == true ? "Yes" : "No",
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Annual Returns ",
                                "helpText": "",
                                "id": 10,
                                "value": "",
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Logo",
                                "helpText": "(Logo matches that in company letterhead)",
                                "id": 11,
                                "value": "",
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            },
                            {
                                "name": "Is Startup under Startup Policy ",
                                "helpText": "(Info provided should satisfy under Startup Policy)",
                                "id": 12,
                                "value": "",
                                "verified": false,
                                "againstDocument": "582cb71201c33a399260e4e5",
                                "verifiedBy": user_id,
                                "verifiedOn": new Date(),
                                "remark": ""
                            }]


                        }

                        $scope.checklist = ($scope.startupData.checklist && $scope.startupData.checklist.listItems.length == 0) ? rmChecklist : $scope.startupData.checklist;
                        if ($scope.startupData.checklist && $scope.startupData.checklist.listItems.length != 0) {

                            $scope.checklist.listItems[0].value = $scope.startupData.basic_details.name;
                            $scope.checklist.listItems[1].value = ($scope.startupData.company_records && $scope.startupData.company_records.incorporation_date) ? $scope.startupData.company_records.incorporation_date = $filter('date')($scope.startupData.company_records.incorporation_date, 'dd/MM/yyyy') : "Not added";
                            $scope.checklist.listItems[2].value = ($scope.startupData.company_records && $scope.startupData.company_records.incorporation_date) ? $scope.startupData.company_records.incorporation_date = $filter('date')($scope.startupData.company_records.incorporation_date, 'dd/MM/yyyy') : "Not added";
                            $scope.checklist.listItems[3].value = $scope.startupData.detailed_background.address;
                            $scope.checklist.listItems[4].value = $scope.startupData.technology_usage.area_of_operation;
                            $scope.checklist.listItems[5].value = $scope.startupData.emp_info.no_of_permanent_emp + '/' + $scope.startupData.emp_info.no_of_permanent_qualified_workforce;
                            $scope.checklist.listItems[6].value = ($scope.startupData.financial_information.indicators[0] && $scope.startupData.financial_information.indicators[0].revenue) == 0 ? $scope.startupData.financial_information.indicators[0].revenue : "Not Applicable";
                            $scope.checklist.listItems[7].value = ($scope.startupData.annexure[0] && $scope.startupData.annexure[0].name == false) ? "Annexure1 Uploaded: " + $scope.startupData.annexure[0].name : "Not Uploaded";
                            $scope.checklist.listItems[8].value = $scope.startupData.incubator_details.is_incubated == true ? "Yes" : "No";
                            $scope.checklist.listItems[9].value = "";
                            $scope.checklist.listItems[10].value = "";
                            $scope.checklist.listItems[11].value = "";
                        }

                        if ($scope.startupData.checklist && $scope.startupData.checklist.listItems.length != 0) {
                            var listValueHelpText = [{ "helpText": "(Should match the COI)" }, { "helpText": "(Should match the COI)" }, { "helpText": "(Should be less than 4 years as per COI)" }, { "helpText": "(Should match the COI)" }, { "helpText": "(Should be satisfactory)" }
                                , { "helpText": "(50% within Karnataka)" }, { "helpText": "(Under 50Cr as per the financial statements)" }, { "helpText": "(Provided by the company on their letterhead as per the format - Annexure1)" }, { "helpText": "(If incubated, should provide incubator endorsement)" }, { "helpText": "" },{ "helpText": "(Logo matches that in company letterhead)" }, { "helpText": "(Info provided should satisfy under Startup Policy)" }];

                            listValueHelpText.forEach(function (value, index, array) {
                                $scope.checklist.listItems[index].helpText = value.helpText;
                            })
                        }

                        $scope.verified_by_nodal = $scope.startupData.checklist.checklistSignedByNodal ? true : false;
                        $scope.verified_by_md = $scope.startupData.checklist.checklistSignedByMD ? true : false;

                        $scope.startupData.comments = response.data.data.startupData.comments.filter(function (comment) {

                            if ($scope.userInfo.type == "Startup") {
                                return comment.isInternalConversation == false;
                            }
                            if (['Relationship', 'Senior', 'Nodal', 'MD'].includes($scope.userInfo.type)) {
                                return comment.isInternalConversation == true;
                            }
                        });



                        $scope.stage = [];

                        $scope.currentState = $scope.startupData.stage[$scope.startupData.stage.length - 1].contentType;
                        // $scope.isCurrentState = (StartupService.getCurrentState(userInfo) == $scope.currentState);
                        QueryService.query('GET', '/api/workflow?state=' + $scope.currentState + '&role=' + $scope.userInfo.type, {}, {})
                            .then(function (response) {
                                $scope.states = response.data.data.flows;
                                if ($scope.states.length > 0) {
                                    if ($scope.userInfo.type != "Relationship") {
                                        $scope.isCurrentState = true;
                                    }
                                    else if ($scope.userInfo.type == "Relationship" && !$scope.startupData.rm_assignee) {
                                        $scope.isCurrentState = false;
                                    }
                                    else if ($scope.userInfo.type == "Relationship" && $scope.startupData.rm_assignee && $scope.startupData.rm_assignee.assignee_id == $scope.userInfo._id) {
                                        $scope.isCurrentState = true;

                                    }

                                }
                            })

                    }, function (error) {
                        MessageService.error(error || error.data);
                        console.error(error.data);
                    });

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



                $scope.insert = function () {
                    var isInternalConversation = false;
                    $scope.isKbitsUser = false;
                    if ($scope.userInfo) {
                        if (['Relationship', 'Senior', 'Nodal', 'MD'].includes($scope.userInfo.type)) {
                            isInternalConversation = true;
                            $scope.isKbitsUser = false;
                        }
                    }
                    var data = { name: window.localStorage.getItem('UserName'), text: $scope.comment.text, date: new Date(), user_id: user_id, isInternalConversation: isInternalConversation }
                    QueryService.query('PUT', '/api/startup/' + $stateParams.registrationId + '/comment', {}, data)
                        .then(function (response) {
                            $scope.startupData.comments.unshift(data);
                            $scope.comment.text = "";
                        }, function (error) {
                            MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.")
                            console.error(error && error.data);
                        });
                };
                $scope.set_state = function (state, startupData, reason_rejection) {
                    $scope.startup_state = state;
                    if (['Rejected', 'UserAction'].indexOf($scope.startup_state.transition) < 0) {
                        var confirm = $mdDialog.confirm()
                            .title('Would you like to continue?')
                            .textContent($scope.startup_state.button)
                            .ariaLabel('Lucky day')
                            .targetEvent(null)
                            .ok('OK')
                            .cancel('Cancel');

                        $mdDialog.show(confirm).then(function () {
                            $scope.status = 'You have sent your application to' + $scope.startup_state.button;
                            $scope.acceptOrRejectForm(startupData, state, reason_rejection);
                        }, function () {
                            $scope.status = 'You decided to Cancel ';
                        });

                    }
                }



                $scope.showFile = function (id) {
                    QueryService.query('GET', '/api/startup/document?id=' + id, {}, {})
                        .then(function (response) {
                            window.open(response.data.data.data.data, '_blank');
                        }, function (error) {
                            console.error(error && error.data);
                            MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.")
                        });


                }

                $scope.status = '  ';
                $scope.customFullscreen = false;

                // $scope.showConfirm = function (ev) {
                //     // Appending dialog to document.body to cover sidenav in docs app

                // };

                $scope.send_message = function (state) {
                    $scope.message = state;
                }

                $scope.acceptOrRejectForm = function (startup, state, reason) {
                    var query = {
                        registration_id: startup._id,
                        designation: state.designation,
                        transition: state.transition,
                        state: state.state,
                        reason: reason,
                        message: state.message
                    }

                    var checklist_verified;
                    var checklist_all_verified;

                    if (startup.checklist.listItems.length > 0) {
                        checklist_all_verified = _.map(startup.checklist.listitems, function (item) {
                            return item.verified === false;
                        });
                        checklist_verified = (checklist_all_verified.length === 0) ? true : false;
                    } else {
                        checklist_verified = false;
                    }

                    if ((state.transition === 'UserAction' || state.transition === 'Rejected') && !reason) {
                        return MessageService.error("Please provide a reason for sending it back to Startup User");
                    }
                    if (state.role === 'Relationship' && state.transition === 'Stage3') {
                        if (!checklist_verified)
                            return MessageService.error("Please ensure the Checklist has been verified");
                    }
                    if (state.role === 'Nodal' && state.transition === 'Stage5') {
                        if (!_.isUndefined(startup.checklist.checklistSignedByNodal) && !$scope.verified_by_nodal)
                            return MessageService.error("Please review/sign the Checklist before further Progress");
                    }
                    if (state.role === 'MD' && state.transition === 'Approved') {
                        if ((!_.isUndefined(startup.checklist.checklistSignedByMD)) && !$scope.verified_by_md)
                            return MessageService.error("Please review/sign the Checklist before further Progress");
                    }
                    QueryService.query('POST', '/api/startup/register', {}, query)
                        .then(function (response) {
                            MessageService.success(response.data.message);
                            if (state.transition === 'UserAction' || state.transition === 'Rejected') $scope.sendMessagetoStartup(startup.user_id, reason, startup._id, state.transition);
                            $state.go('home-kbits')
                        }, function (error) {
                            MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                            console.error(error || error.data);
                        });
                }

                $scope.sendMessagetoStartup = function (userId, reason, startupId, state) {
                    QueryService.query('POST', '/api/kbits/message', {}, { startup_user: userId, message: reason, id: startupId, state: state })
                        .then(function (res) {
                            MessageService.success(res.data.message);
                            $state.go('home-kbits')
                        }, function (error) {
                            MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.")
                            console.error(error || error.data);
                        });
                }

                $scope.goHome = function () {

                    if (['Relationship', 'Senior', 'Nodal', 'MD'].includes(window.localStorage.getItem('AccessLevel'))) {
                        $state.go('home-kbits')
                    } else {
                        $state.go('home')
                    }
                }

                QueryService.query('GET', '/api/startup/document?registration_id=' + startupId, {}, {})
                    .then(function (response) {
                        $scope.doc_list = Object.keys(response.data.data.data).filter(function (list) { return list != '_id' }).reduce(function (pv, cv) { return pv.concat(response.data.data.data[cv]) }, []);
                    }, function (error) {
                        MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                        console.error(error);
                    });


                $scope.check = function (checklist) {
                    QueryService.query('POST', '/api/startup/checklist?id=' + startupId, {}, { checklist: checklist })
                        .then(function (response) {
                            $scope.startupData = response.data.data;
                            MessageService.success("Checklist has been updated successfully");
                        }, function (error) {
                            MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                        });
                }


                $scope.changeStatus = function (status) {
                    status.verified = !status.verified;
                }


                $scope.checkedBy = function (verified_by, user) {
                    if (user == 'md') {
                        $scope.verified_by_md = !verified_by;
                    } else if (user == 'nodal') {
                        $scope.verified_by_nodal = !verified_by;
                    }

                    var verified_by_user = {
                        "signedBy": user_id,
                        "signType": $scope.userInfo.type
                    };
                    if ($scope.verified_by_nodal || $scope.verified_by_md) {
                        QueryService.query('POST', '/api/startup/signed_by?id=' + startupId, {}, verified_by_user)
                            .then(function (response) {
                                $scope.startupData = response.data.data;
                                MessageService.success("Checklist has been signed successfully");
                            }, function (error) {
                                console.error(error && error.data);
                                MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                            });
                    }
                }
                //// Payment function ////
                $scope.savePayment = function (id) {
                    if (!$scope.amount || !$scope.processing_date) {
                        return MessageService.error("Please provide the amount of Fees and Date of Collection.");
                    }
                    var fee = {
                        "processingFeeCollected": $scope.amount,
                        "processingFeeCollectedDate": $scope.processing_date
                    };

                    QueryService.query('POST', '/api/startup/process_fees?id=' + id, {}, { processing_fees: fee })
                        .then(function (response) {
                            MessageService.success(response.data.message);
                            $scope.startupData.processingFees = response.data.data.data;
                            $scope.checklist.listItems[12].value = $scope.startupData.processingFees.processingFeeCollected;
                        }, function (error) {
                            console.error(error || error.data);
                            MessageService.error(error || error.data);
                        });
                }

                $scope.assignToRM = function (userId, startupId) {
                    QueryService.query('POST', '/api/startup/register', {}, { rm_assignee: { assignee_id: userId, name: $scope.userInfo.first_name + " " + $scope.userInfo.last_name }, startupId: startupId })
                        .then(function (response) {
                            $scope.startupData.rm_assignee = { assignee_id: userId, name: $scope.userInfo.first_name + " " + $scope.userInfo.last_name };
                            $scope.isCurrentState = true;
                            MessageService.success("Document has been assigned to me");
                        }, function (error) {
                            console.error(error || error.data);
                            MessageService.error(error || error.data);
                        });
                }

            }

        ])

        .filter('YesNo', function () {
            return function (text) {
                return text ? "Yes" : "No";
            }
        })

})();
