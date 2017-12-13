/**
 *
 * AngularJS Boilerplate
 * @description           Description
 * @author                Jozef Butko // www.jozefbutko.com/resume
 * @url                   www.jozefbutko.com
 * @version               1.1.7
 * @date                  March 2015
 * @license               MIT
 *
 */
;(function() {
    'use strict';

    /**
     * Definition of the main app module and its dependencies
     */
    angular
        .module('kbitsApp', [
            'ui.router',
            'angular-loading-bar',
            'angularjs-dropdown-multiselect',
            'kbitsApp.components',
            'kbitsApp.env',
            'kbitsApp.routes',
            'kbitsApp.controllers',
            'kbitsApp.layout',
            'ui.bootstrap',
            'ngAnimate',
            'kbitsApp-templates',  
            'ngMaterial',
            'nvd3ChartDirectives',
        ])
        .config(config);


    // safe dependency injection
    // this prevents minification issues
    config.$inject = [
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        '$compileProvider',
        'cfpLoadingBarProvider'
    ];

    /**
     * App routing
     *
     * You can leave it here in the config section or take it out
     * into separate file
     *
     */
    function config(
        $locationProvider,
        $stateProvider,
        $urlRouterProvider,
        $httpProvider,
        $compileProvider,
        cfpLoadingBarProvider ) {
        /* Place the loding bar down from the title bar */
        // $locationProvider.html5Mode(false);
        // Yeah we wanna to use HTML5 urls!
        $locationProvider
          .html5Mode({
                enabled: true,
                requireBase: false
          })
        .hashPrefix('!');
       
//        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):|data:image\//);
          $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
        // routes
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('master', {
              url: '',
              abstract: true,
              views: {
                'header@': {
                  templateUrl: '/kbitsApp/layout/partials/header.html',
                  controller: 'HeaderCtrl'
                },
                'footer@': {
                  templateUrl: '/kbitsApp/layout/partials/footer.html',
                  controller: 'FooterController'
                }
              }
            })

            .state('login_master', {
              url: '',
              abstract: true,
              views: {
                'login_header@': {
                  templateUrl: '/kbitsApp/layout/partials/login-header.html'
                  // controller: 'HeaderCtrl'
                },
                'footer@': {
                  templateUrl: '/kbitsApp/layout/partials/footer.html',
                  // controller: 'FooterController'
                }
              }
            })        

    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.interceptors.push('ErrorInterceptor');

    }

    /**
     * Run block
     */
    angular
        .module('kbitsApp')
        .run(run);

    run.$inject = ['$rootScope', '$state', '$stateParams',
                   '$injector', '$location', 'AuthService', '$sce'];

    function run($rootScope, $state, $stateParams,
                 $injector, $location, AuthService, $sce) {

        $rootScope.goBack = function(){
            window.history.back();
        };
        $rootScope.log = function(obj,type){
          type = type || 'log'
          if(typeof(obj)=='object'){
            console[type](obj.data || obj.message || obj);
          }else if(typeof(obj)=='string'){
            console[type](obj);
          }
        };
        $rootScope.logError = function(data){
          rootScope.log(data,'error');
        };
        $rootScope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };
        // put here everything that you need to run on page load
        $rootScope.location = $location;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeStart', function(event, toState) {

            var token = localStorage.token;
            /**
             * Route state change start event, this is needed for following:
             *  1) Check if user is authenticated to access page, and if not redirect user back to login page
            //  */
            // if (!AuthService.authorize(toState.data.access)) {

            //   event.preventDefault();
            //     $injector.get('MessageService')
            //     .warning("Sorry, you are not authorized to access the information.\
            //                           Please contact the System Admin")
            // }

            // if (toState.name != 'login' && toState.name != 'newRegister')
            //             //&& ( undefined == token || 0 == token.trim().length ))
            // {
            //     $state.transitionTo('login');
            //     event.preventDefault();
            // }
            // else
            // {
            //     return;
            // }
        });

        // $rootScope.$on('$viewContentLoaded', function(event, toState) {
        //     $('.eq-screen-header').affix({
        //       offset: {
        //         top: function () {
        //             return (this.top = $(".eq-screen-header").offset().top);
        //           }
        //         }
        //     });
        // });
    }

    })();
