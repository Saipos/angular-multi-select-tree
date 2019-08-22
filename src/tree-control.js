/*jshint indent: 2 */
/*global angular: false */

(function () {
    'use strict';
    var mainModule = angular.module('multi-select-tree');
    
    mainModule.controller('treeControlCtrl', ['$scope', function($scope) {
        $scope.onClick = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            if ($scope.instance.disabled) return;

            var valueContainerClicked = $scope.instance.getValueContainer().contains($event.target);
            if (valueContainerClicked && !$scope.instance.showTree)
              $scope.instance.openPopup();

            $scope.instance.focusInput();
          };
      }]);

    mainModule.directive('treeControl', 
        function() {
            return {
                restrict: 'E',
                templateUrl: 'src/tree-control.tpl.html',
                controller: 'treeControlCtrl',
                scope: {
                    instance: '='
                  }
                };
          });
  }());