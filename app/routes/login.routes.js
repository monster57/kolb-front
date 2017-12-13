angular.module('kbitsApp.routes')
    .config(['$stateProvider', '$urlRouterProvider', 'CONSTANTS',
        function ($stateProvider, $urlRouterProvider, CONSTANTS) {
            $stateProvider
                .state('newRegister', {
                    url: '/register',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/user/registration.html',
                            controller: 'registerCtrl'
                        }
                    },
                    parent: 'login_master',
                    data: {
                        access: CONSTANTS.AccessLevels.anon
                    },
                })
                .state('login', {
                    url: '/login',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/login/login.html',
                            controller: 'loginCtrl'
                        }
                    },
                    parent: "login_master",
                    data: {
                        // access: CONSTANTS.AccessLevels.anon,
                        screen_title: 'Login To KBits App'
                    },
                })
                .state('test', {
                    url: '/test',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/login/test.html',
                            controller: 'testCtrl'
                        }
                    },
                    data: {
                        access: CONSTANTS.AccessLevels.anon
                    },
                })

            
        }
    ]);
