/*jshint indent: 2 */
/*global angular: false */

(function () {
    'use strict';
    var mainModule = angular.module('multi-select-tree');
    
    mainModule.controller('treeFilterInputCtrl', ['$scope', function($scope) {
        var KEY_CODES = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESCAPE: 27,
            END: 35,
            HOME: 36,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40,
            DELETE: 46
          };
      
        var keysThatRequireMenuBeingOpen = [
            KEY_CODES.ENTER,
            KEY_CODES.END,
            KEY_CODES.HOME,
            KEY_CODES.ARROW_LEFT,
            KEY_CODES.ARROW_UP,
            KEY_CODES.ARROW_RIGHT,
            KEY_CODES.ARROW_DOWN
          ];

        $scope.onBlur = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.instance.onInputBlur($event);
          };

        $scope.onKeydown = function($event) {
            var key = 'which' in $event ? $event.which : $event.keyCode;

            if ($event.ctrlKey || $event.shiftKey || $event.altKey || $event.metaKey)
              return;

            if (!$scope.instance.showTree && keysThatRequireMenuBeingOpen.indexOf(key) !== -1) {
              $event.preventDefault();
              $scope.instance.openPopup();
              return;
            }

            switch (key) {
            case KEY_CODES.TAB:
              if ($scope.instance.activeItem && !$scope.instance.multiSelect) {
                $scope.instance.itemSelected($scope.instance.activeItem);
              }
              $scope.instance.closePopup();
              break;
            case KEY_CODES.ESCAPE:
              if ($scope.instance.filterKeyword && $scope.instance.filterKeyword.length > 0) {
                $scope.instance.clearFilter();
              } else if ($scope.instance.showTree) {
                $scope.instance.closePopup();
              }
              break;
            case KEY_CODES.BACKSPACE:
              if ($scope.instance.getInput().value.length === 0) {
                $event.preventDefault();
                $scope.instance.removeLastSelected();
              }
              break;
            case KEY_CODES.ARROW_LEFT:
              $event.preventDefault();
              if ($scope.instance.activeItem && $scope.instance.activeItem.isExpanded) {
                $scope.instance.itemExpandToggle($scope.instance.activeItem);
              } else if ($scope.instance.activeItem && $scope.instance.activeItem.parent_id) {
                var parent_item = $scope.instance.getItemAt($scope.instance.getItemIndex($scope.instance.activeItem.parent_id));
                $scope.instance.itemExpandToggle(parent_item);
                $scope.instance.onActiveItem(parent_item);
              }
              break;
            case KEY_CODES.ARROW_UP:
              $event.preventDefault();
              $scope.instance.activePreviousItem();
              break;
            case KEY_CODES.ARROW_RIGHT:
              $event.preventDefault();
              if (!$scope.instance.activeItem.isExpanded && $scope.instance.activeItem.children && $scope.instance.activeItem.children.length > 0)
                $scope.instance.itemExpandToggle($scope.instance.activeItem);
              break;
            case KEY_CODES.ARROW_DOWN:
              $event.preventDefault();
              $scope.instance.activeNextItem();
              break;
            case KEY_CODES.ENTER:
              $event.preventDefault();
              if ($scope.instance.activeItem) {
                $scope.instance.itemSelected($scope.instance.activeItem);
              }
              break;
            case KEY_CODES.HOME:
              $event.preventDefault();
              $scope.instance.activeFirstItem();
              break;
            case KEY_CODES.END:
              $event.preventDefault();
              $scope.instance.activeLastItem();
              break;
            default:
              if (!$scope.instance.showTree)
                $scope.instance.openPopup();
            }
          };
      }]);

    mainModule.directive('treeFilterInput', 
        function() {
            return {
                restrict: 'E',
                templateUrl: 'src/tree-filter-input.tpl.html',
                controller: 'treeFilterInputCtrl',
                scope: {
                    instance: '='
                  }
                };
          });
  }());