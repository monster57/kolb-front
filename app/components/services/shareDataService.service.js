/**
 * Simple service to share data across two Controllers.
 */
 (function() {
 'use strict';
 angular.module('kbitsApp')
 .service('shareDataService', function() {
    var myList = myList || {};

    var addList = function(key,newObj) {
        myList[key] = newObj ;
    }

    var getList = function(key){
        return myList[key];
    }

    return {
        addList: addList,
        getList: getList
    };
});
}());
