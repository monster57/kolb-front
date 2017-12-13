(function() {
    'use strict';
    angular.module('kbitsApp.controllers')
        .controller('StartupSaveCtrl', ['MessageService', 'CONSTANTS', 'StartupService', '$sce', '$state', '$timeout', '$scope', 'QueryService',
            function(MessageService, CONSTANTS, StartupService, $sce, $state, $timeout, $scope, QueryService) {
                /**
                 * Init the scope variables
                 */
                $scope.finantialData = {};
                StartupService.initVariables($scope);
                $scope.startupFile = {
                    id: "",
                    incorporation: [{}],
                    annexure: [{}],
                    additional: [{}],
                    financial: [{}],
                    attorney: [{}],
                    operative: [{}]
                };
                $scope.annexureUrl1 = CONSTANTS.API_URL + '/docs/Annex-I.docx'
                $scope.annexureUrl2 = CONSTANTS.API_URL + '/docs/Annex-II.docx'

                $scope.onUpload = function(form, field) {
                    ($scope[field]) ? "" : ($scope[field] = []);
                    StartupService.fileUpload(form, $scope[field]);
                };


                ///  Area of operation list  ///
                QueryService.query('GET', '/api/area_of_operation')
                    .then(function(response) {
                        $scope.area_of_operations = response.data.data.data;
                    }),
                    function(error) {
                        console.error(error && error.data);
                    }

                var isFormFilled = function() {
                    $scope.submitEnable = $scope.technology_usage.is_clicked && $scope.incubator_details.is_clicked && $scope.promotion.is_clicked && $scope.incubator_details.is_clicked && $scope.detailed_background.is_clicked && $scope.self_cerfication.is_clicked && $scope.emp_info.is_clicked && $scope.company_records.is_clicked && $scope.is_annexure_filled;
                };

                function getPreviousfinantialYear(count) {
                    var date = new Date();
                    var currentYear = "";
                    var isCompleted = date.getMonth() >= 3;
                    if (isCompleted) {
                        return date.getFullYear() - count
                    }
                    return date.getYear() - (count + 1)
                }


                function finantialYearData(min, max, step) {
                    var input = [];
                    step = step || 1;
                    var year = "";
                    for (var i = min; i <= max; i += step) {
                        year = getPreviousfinantialYear(i)
                        input.push({
                            "year": year + "-" + (year - 1),
                            "profit_before_tax": "",
                            "net_worth": "",
                            "reserves_surplus": "",
                            "revenue": ""
                        });
                    }
                    return input;
                };

                $scope.createOrUpdateStartup = function(data, nextTab , formName) {
                    var tab = Object.keys(data);

                    if (data[tab[0]].is_clicked == 0) {
                        data[tab[0]].is_clicked = true;
                        $scope[tab[0]].is_clicked = true;
                    }
                    QueryService.query('POST', '/api/startup/register', {}, data)
                        .then(function(response) {
                            MessageService.success("The Startup has been saved");
                            isFormFilled();
                            if(formName){
                                $scope[formName].$dirty = false;
                            }
                            (nextTab) && $scope.setTab(nextTab);
                        }, function(error) {
                            console.error(error || error.data);
                        });
                };

                QueryService.query('GET', '/api/user/startup')
                    .then(function(res) {
                        StartupService.assignData($scope, res.data.data.startupData);
                        $scope.finantialData.indicators = ($scope.startup.financial_information.indicators.length == 0) ? finantialYearData(1, 3) : $scope.startup.financial_information.indicators;
                        $scope.finantialData.check = $scope.startup.financial_information.check;
                        $scope.finantialData.is_clicked = $scope.startup.financial_information.is_clicked;
                        $scope.finantialData.related_docs = $scope.startup.financial_information.related_docs || [];
                        $scope.startupFile.id = res.data.data.startupData._id;

                        Object.keys($scope.startupFile).forEach(function(key) {
                            if (key != 'id') {
                                res.data.data.startupData[key].forEach(function(fileReference, index, array) {
                                    var file = { id: fileReference.upload_id, name: fileReference.name };
                                    if (Object.keys($scope.startupFile[key][0]).length == 1 || Object.keys($scope.startupFile[key][0]).length == 0) {
                                        $scope.startupFile[key].pop();
                                    }
                                    $scope.startupFile[key].push(file);
                                    if (Object.keys($scope.startupFile[key][0]).length != 1 && array.length > 0 && index == (array.length - 1)) {
                                        $scope.startupFile[key].push({});
                                    }
                                });
                            }
                        });
                        $scope.is_annexure_filled = false;
                        $scope.annexure_form.$valid = false;                            
                        if ($scope.annexure[0] && $scope.annexure[0].upload_id) {
                            $scope.is_annexure_filled = true;
                            $scope.annexure_form.$valid = true;

                        }
                        isFormFilled();
                    }, function(error) {
                        MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.")
                        console.error(error && error.data);
                    });

                $scope.registerStartup = function(data, nextTab , formName) {
                    $scope.createOrUpdateStartup(data, nextTab , formName)
                };

                $scope.submit = function(data) {
                    QueryService.query('POST', '/api/startup/register', {}, data)
                        .then(function(response) {
                            MessageService.success("The Startup has been saved");
                        }, function(error) {
                            console.error(error || error.data);
                        });
                }

                /**
                 * init the side bar with the previous data
                 */
                $scope.isFilled = StartupService.isNavBarFilled.bind(null, $scope);
                /**
                 * Submit
                 */
                $scope.submitStartup = function(id, lastState) {
                    if (lastState.toLowerCase() == "useraction") {
                        $scope.submit({ is_resubmitted: true });
                        MessageService.success("Your details has been resubmitted successfully");
                    } else {
                        $scope.submit({ is_submitted: true });
                        MessageService.success("Your details has been submitted successfully");

                    }
                    //  $state.go('submit-details');
                    $state.transitionTo('submit-details', { id: id });
                };

                // $scope.saveDocument = function (data) {
                //     var files = data.incorporation.concat(data.annexure).concat(data.financial).concat(data.additional).concat(data.attorney).concat(data.operative).filter(function (file) {
                //         return Object.keys(file).length > 0;
                //     });
                //     QueryService.query('POST', '/api/startup/document/submit', {}, { id: data.id, files: files })
                //         .then(function (response) {
                //             MessageService.success("Your details has been submitted successfully");
                //         }, function (error) {
                //             console.error(error && error.data);
                //             MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.");
                //         });
                // }

                ///////  Nav side bar ////////
                $scope.tab = 1;

                $scope.setTab = function(newTab, data) {
                    $scope.tab = newTab;
                };

                $scope.isSet = function(tabNum) {
                    return $scope.tab === tabNum;
                };

                /**
                 * Trust URl
                 */

                $scope.trustSrc = function(data) {
                    return $sce.trustAsResourceUrl(data);
                };

                /**
                 * File Upload for the incorporation_certificate
                 */


                $scope.addFile = function(mode, files) {
                    $scope.startupFile[mode].push({});
                    // var newFile= $scope.files.length+1;
                    // $scope.files.push({'id':'choice'+newFile});
                }

                $scope.removeFile = function(file, index, areaType) {
                    QueryService.query('POST', '/api/startup/document/remove', {}, { startup_id: $scope.startupFile.id, areaType: areaType, document_id: file.id })
                        .then(function(response) {
                            MessageService.success("The file has been removed");
                            $scope.startupFile[areaType].splice(index, 1);
                        }, function(error) {
                            console.error(error && error.data);
                        });
                }


                $scope.uploadSingleFile = function(form, areaType, indexofFile) {
                    var index = (indexofFile || angular.element(form).scope().$index || 0);
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $timeout(function() {
                            if (form.files[0].size < 2000000) {
                                var arr = []
                                var file = { name: form.files[0].name, mimeType: form.files[0].type, data: e.target.result, areaType: areaType };
                                if ($scope.startupFile[areaType][index] && $scope.startupFile[areaType][index].id) {
                                    file.id = $scope.startupFile[areaType][index].id
                                }
                                arr.push(file);
                                $scope.startupFile[areaType].splice(index, 1, file);
                                QueryService.query('POST', '/api/startup/document/submit', {}, { id: $scope.startupFile.id, files: arr })
                                    .then(function(response) {
                                        MessageService.success("File has been uploaded");
                                        var uploadFile = response.data.data.data[areaType][index];
                                        $scope.startupFile[areaType][index] = { id: uploadFile.upload_id, name: uploadFile.name }
                                        if (index == ($scope.startupFile[areaType].length - 1)) {
                                            $scope.startupFile[areaType].push({});
                                        }
                                        $scope.annexure = response.data.data.data.annexure;
                                        $scope.annexure_form.$valid = false;
                                        if ($scope.annexure[0] && $scope.annexure[0].upload_id) {
                                            $scope.is_annexure_filled = true;
                                            $scope.annexure_form.$valid = true;
                                            isFormFilled();

                                        }
                                        


                                    }, function(error) {
                                        console.error(error && error.data);
                                    });
                            } else {
                                MessageService.error("Can not upload more than 2mb file size");
                            }

                        });
                    };
                    reader.readAsDataURL(form.files[0]);
                };
                $scope.copyCeoDataToBackground = function() {
                    $scope.detailed_background.founder_mobile = $scope.detailed_background.CEO_mobile_number;
                    $scope.detailed_background.founder_emailId = $scope.detailed_background.CEO_email_id;
                }

                $scope.copyCeoDataToAuthrize = function() {
                    $scope.detailed_background.authorized_person_mobile = $scope.detailed_background.CEO_mobile_number;
                    $scope.detailed_background.authorized_person_emailId = $scope.detailed_background.CEO_email_id;
                    $scope.detailed_background.authorized_person_land_line = $scope.detailed_background.CEO_land_line_number;
                    $scope.detailed_background.authorized_person_name = $scope.detailed_background.CEO_name;
                }

                $scope.makeDirty = function(formName){
                    $scope[formName].$dirty = true;
                }


                //    $scope.saveBasicDetails = StartupService.saveBasicDetails.bind(null, $scope);

                ///////  year calendar  ////////
                $('#datetimepicker1').datetimepicker({
                    viewMode: 'years',
                    format: 'YYYY'
                })
                $('#datetimepicker2').datetimepicker({
                    viewMode: 'years',
                    format: 'YYYY'
                })
                $('#datetimepicker3').datetimepicker({
                    viewMode: 'years',
                    format: 'YYYY'
                })

            }
        ])
})();
