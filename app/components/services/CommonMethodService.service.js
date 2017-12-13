/**
 * Simple service to share common functions across two Controllers.
 */
 (function() {
 'use strict';
 angular.module('kbitsApp')
 .service('CommonMethodService', function() {

    var filterParams = function(inputObject,filterKeys) {
        var resultObject = {}
        for(var key in inputObject){
            if(filterKeys.indexOf(key) > -1){
                resultObject[key] = inputObject[key];
            }
        }
        return resultObject;
    }

    return {
        filterParams: filterParams,
    };
});
}());
