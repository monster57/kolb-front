;
(function() {
    'use strict';
    angular.module('kbitsApp.controllers')

    .controller('UserEmailVerificationCtrl', ['MessageService', '$state', '$location', 'QueryService',
        function(MessageService, $state, $location, QueryService) {
            var url =  ($location.url()).split("?")[1];
            QueryService.query('GET', '/api/email_verification?' + url, {}, {})
                .then(function(response) {
                    var data = response.data;
                    MessageService.success('You have successfully registered');
                    $state.go('login');
                }, function(error) {
                    console.error(error.data);
                });
        }
    ])
})();
