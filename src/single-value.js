/*jshint indent: 2 */
/*global angular: false */

(function () {
    'use strict';
    var mainModule = angular.module('multi-select-tree');

    mainModule.directive('singleValue', 
        function() {
            return {
                restrict: 'E',
                templateUrl: 'src/single-value.tpl.html',
                scope: {
                    instance: '=',
                    item: '='
                  }
                };
          });
  }());