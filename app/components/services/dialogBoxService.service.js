(function() {
    'use strict';
    angular.module('kbitsApp.components.services')
        .service('DialogBoxService', ['$mdMedia', '$mdDialog', 'QueryService', 'MessageService', '$uibModal',
            dialogBox
        ]);

    function dialogBox($mdMedia, $mdDialog, QueryService, MessageService, $uibModal) {
        var open = function(scope, data, cb) {
            scope.status = '  ';
            var useFullScreen = $mdMedia('xs') || $mdMedia('sm');
            
            $mdDialog.show({
                    controller: data.controller,
                    templateUrl: data.templateUrl,
                    parent: angular.element(data.body),
                    targetEvent: data.ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        data: data.item,
                        itemStatus:data.itemStatus
                    }
                })
                .then(cb);

            scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        return {
            open: open,
        }
    }
}());
