(function() {
    'use strict';
    angular.module('kbitsApp.components.services')
        .factory('otpService', ['$uibModal', '$rootScope', otpService]);

    function otpService($uibModal, $rootScope) {

        var modal = function(data) {
            if (typeof data === 'object') {
                $rootScope.email = data.email;
                $rootScope.mobile = data.mobile;
            }
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/kbitsApp/views/login/otp_modal.html',
                controller: 'otpModalCtrl',
                backdrop: false,
                keyboard: false
            });
            modalInstance.result.then(function(result) {
                $rootScope.nextState = result && result.state;
            });
            return modalInstance;
        };

        function dismiss(reason) {
            var otpModal = $rootScope.otpModal;
            /*
             * If otpModal then close it;
             */
            otpModal && otpModal.close(reason);
        };
        return {
            modal: modal,
            dismissModal: dismiss
        };
    }
}());
