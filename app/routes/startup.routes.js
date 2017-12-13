angular.module('kbitsApp.routes')
    .config(['$stateProvider', '$urlRouterProvider', 'CONSTANTS',
        function($stateProvider, $urlRouterProvider, CONSTANTS) {
            $stateProvider
                .state('registerStartup', {
                    url: '/registerStartup',
                    parent: 'master',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/startup/register.html',
                            controller: 'StartupSaveCtrl'
                        }
                    },
                    data: {
                        access: CONSTANTS.AccessLevels.user,
                        screen_title: 'Register Your Startup'
                    },
                })
                .state('startup' , {
                    url: '/startup:registrationId',
                    parent: 'master',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/user/user_details.html',
                            controller: 'StartupFetchCtrl'
                        }
                    },
                    data: {
                        access: CONSTANTS.AccessLevels.user,
                        screen_title: 'Startup'
                    },

                    params:{
                        registrationId: null
                    }

                })
                .state('category' , {
                    url: '/category:categoryName',
                    parent: 'master',
                    views: {
                        'content@': {
                            templateUrl: '/kbitsApp/views/category/category.html',
                            controller: 'CategoryCtrl'
                        }
                    },
                    data: {
                        access: CONSTANTS.AccessLevels.user,
                        screen_title: 'Kbit'
                    },

                    params:{
                        categoryName: null
                    }

                })
        }
    ]);