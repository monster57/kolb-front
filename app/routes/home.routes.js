angular.module('kbitsApp.routes')
    .config(['$stateProvider', '$urlRouterProvider', 'CONSTANTS',
        function($stateProvider, $urlRouterProvider, CONSTANTS) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    parent: 'master',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/home/home.html',
                            controller: 'HomeStartupCtrl'
                        }
                    },
                    data: {
                        access: 'Startup',
                        screen_title: 'Welcome'
                    },
                })
               .state('home-kbits', {
                    url: '/home-kbits',
                    parent: 'master',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/home/home-kbits.html',
                            controller: 'HomeKBitsCtrl'
                        }
                    },
                    data: {
                        access: 'Kbits',
                        screen_title: 'Welcome'
                    },
                })

                .state('submit-details', {
                    url: '/submit-details',
                    parent: 'master',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/user/submitted_details.html',
                            controller: 'SubmittedDetailsCtrl'
                        }
                    },
                    data: {
                        access: 'Kbits',
                        screen_title: 'Details'
                    },
                })
        }
    ]);
