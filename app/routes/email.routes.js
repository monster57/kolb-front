angular.module('kbitsApp.routes')
    .config(['$stateProvider', '$urlRouterProvider', 'CONSTANTS',
        function($stateProvider, $urlRouterProvider, CONSTANTS) {
            $stateProvider
                .state('user_email_verification', {
                    url: '/verify_user_email',
                    parent: 'master',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/user/user_email_verification.html',
                            controller: 'UserEmailVerificationCtrl'
                        }
                    },
                    data: {
                        access: CONSTANTS.AccessLevels.user,
                        screen_title: 'Welcome'
                    },
                })
                .state('forgot_password', {
                    url: '/reset_password',
                    parent: 'login_master',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/user/reset_password.html',
                            controller: 'ForgotPasswordCtrl'
                        }
                    },
                    data: {
                        access: CONSTANTS.AccessLevels.user,
                        screen_title: 'Welcome'
                    },
                })
        }
    ]);
