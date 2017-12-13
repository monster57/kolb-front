/**
 * Angular module for 'components' component.
 */
;(function() {
  'use strict';

  angular.module('kbitsApp.components', [
    // 'frontend.core.dependencies', // Note that this must be loaded first
    // 'frontend.core.auth',
    // 'frontend.core.components',
    'kbitsApp.components.directives',
    'kbitsApp.components.interceptors',
    // 'frontend.core.layout',
    'kbitsApp.components.services'
  ]);
}());
