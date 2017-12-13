/**
 * Simple service to share common functions across two Controllers.
 */
(function () {
    'use strict';
    angular.module('kbitsApp')
        .service('StartupService', ['QueryService', '$timeout', 'MessageService', function (QueryService, $timeout, MessageService) {

            var initVariables = function (scope) {
                scope.file = {};
                scope.startup = {
                    'basic_details': {},
                    'technology_usage': {},
                    'company_records': {
                    },
                    'financial_information': {
                    },
                    'emp_info': {},
                    annexure:[],
                    // 'self_cerfication': {},
                    "detailed_background": {},
                    'promotion': {},
                    'incubator_details': { file: {} },
                    additional_document:{},
                    'user_id': scope.user,
                };
            };

            var assignData = function (scope, data) {
                if (!_.isEmpty(data)) {
                    scope.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                    _.merge(scope, data);
                    if (data.stage.length > 0) {
                        scope.lastStage = data.stage[data.stage.length-1];
                        scope.status = (data.stage[data.stage.length - 1].contentType.toLowerCase() !== 'submit');
                    }
                    if (data.company_records) {
                        scope.company_records.commercial_commencement_date = new Date(data.company_records.commercial_commencement_date || new Date());
                        scope.company_records.incorporation_date = new Date(data.company_records.incorporation_date || new Date());
                    }
                    if (data.basic_details) {
                        scope.companyWebsite = data.basic_details.url || scope.userInfo.website_url;
                        scope.companyName = data.basic_details.name || scope.userInfo.company_name;
                        if (data.basic_details.logo) {
                            scope.companyLogo = data.basic_details.logo.data;
                        }
                    }
                    if (scope.detailed_background) {
                        scope.detailed_background.CEO_mobile_number = scope.detailed_background.CEO_mobile_number ? scope.detailed_background.CEO_mobile_number.toString(): null ;
                        scope.detailed_background.pincode = scope.detailed_background.pincode ? scope.detailed_background.pincode.toString() : null;
                        scope.detailed_background.authorized_person_mobile = scope.detailed_background.authorized_person_mobile ? scope.detailed_background.authorized_person_mobile.toString():null;
                        scope.detailed_background.company_mobile_number = scope.detailed_background.company_mobile_number ? scope.detailed_background.company_mobile_number.toString():null;
                        scope.detailed_background.founder_mobile = scope.detailed_background.founder_mobile ? scope.detailed_background.founder_mobile.toString() : null;
                    }
                    if (data.financial_information) {
                        scope.startup.financial_information = data.financial_information;
                    }
                };
            };

            var saveBasicDetails = function (scope, userBasicDetails) {
                QueryService.query('POST', '/api/startup/register', {}, { basic_details: userBasicDetails })
                    .then(function (response) {
                        scope.basic_details = response.data.data.Startup.basic_details;
                    }, function (error) {
                        MessageService.error(error || error.data || "Server Error Occured, Please Contact the Administrator.")
                        console.error(error && error.data);
                    });

            }


            var isNavBarFilled = function (scope, formName) {
                if (scope[formName] && scope[formName].$valid) {
                    scope.isFormFiled = true;
                    return "fa fa-star icon-success pull-right"
                } else if (scope[formName] && scope[formName].$dirty) {
                    return "fa fa-star-half-o icon-info pull-right"
                } else {
                    return "fa fa-star-o icon-danger pull-right"
                };
            };
            var getCurrentState = function (user) {
                var useRoleMapper = { 'Relationship': 'Submit', 'Senior': 'Stage3', 'Nodal': 'Stage4', 'MD': 'Stage5' };
                return useRoleMapper[user.type];
            };

            /**
             * File Upload for the incorporation_certificate
             */

            var fileUpload = function (form, field) {
                (field) ? "" : (field = []);

                var reader = new FileReader();
                reader.onload = function (e) {
                    $timeout(function () {
                        field.push({ name: e.name, data: e.target.result });
                    });
                };
                for (var i = 0; i < form.files.length; i++) {
                    reader.readAsDataURL(form.files[0]);
                }
            };

            return {
                fileUpload: fileUpload,
                initVariables: initVariables,
                assignData: assignData,
                isNavBarFilled: isNavBarFilled,
                saveBasicDetails: saveBasicDetails,
                getCurrentState: getCurrentState
            };
        }]);
} ());
