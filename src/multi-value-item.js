/*jshint indent: 2 */
/*global angular: false */

(function () {
    'use strict';
    var mainModule = angular.module('multi-select-tree');
    
    mainModule.controller('multiValueItemCtrl', ['$scope', function($scope) {
        $scope.onClick = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.instance.deselectItem($scope.item);
          };
      }]);

    mainModule.directive('multiValueItem', 
        function() {
            return {
                restrict: 'E',
                templateUrl: 'src/multi-value-item.tpl.html',
                controller: 'multiValueItemCtrl',
                scope: {
                    instance: '=',
                    item: '='
                  }
                };
          });
  }());