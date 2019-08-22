/*jshint indent: 2 */
/*global angular: false */

(function () {
    'use strict';
    var mainModule = angular.module('multi-select-tree');

    mainModule.controller('treePopupCtrl', ['$scope', '$timeout', '$window', function($scope, $timeout, $window) {
        
        function findScrollParents($el) {
          var $scrollParents = [];
          var $parent = $el.parentNode;
          
          while ($parent && $parent.nodeName !== 'BODY' && $parent.nodeType === document.ELEMENT_NODE) {
            if (isScrollElement($parent)) 
              $scrollParents.push($parent);
            $parent = $parent.parentNode;
          }
          $scrollParents.push(window);
          
          return $scrollParents;
        }
        
        function isScrollElement($el) {
          // Firefox wants us to check `-x` and `-y` variations as well
        //   var { overflow, overflowX, overflowY } = getComputedStyle($el);
          var elementStyle = getComputedStyle($el);
        //   console.log($el, elementStyle.overflow, elementStyle.overflowY, elementStyle.overflowX);
          return (/(auto|scroll|overlay)/).test(elementStyle.overflow + elementStyle.overflowY + elementStyle.overflowX);
        }

        function adjustPopupOpenDirection() {
            if (!$scope.instance.showTree) return;
            var popupElement = $scope.instance.getPopup();
            var controlElement = $scope.instance.getControl();
            var popupRect = popupElement.getBoundingClientRect();
            var controlRect = controlElement.getBoundingClientRect();
            var spaceAbove = controlRect.top;
            var spaceBelow = $window.innerHeight - controlRect.bottom;

            var isControlInViewport = (
              (controlRect.top >= 0 && controlRect.top <= $window.innerHeight) ||
              (controlRect.top < 0 && controlRect.bottom > 0)
            );

            var hasEnoughSpaceBelow = spaceBelow > popupRect.height;// + MENU_BUFFER;
            var hasEnoughSpaceAbove = spaceAbove > popupRect.height;// + MENU_BUFFER;

            if (!isControlInViewport) {
              $scope.instance.closePopup();
            } else if (hasEnoughSpaceBelow || !hasEnoughSpaceAbove) {   
              $scope.instance.setPopupBelow();
            } else {
              $scope.instance.setPopupAbove();     
            }
            $scope.$apply();
          }
        // $scope.instance.setPopupBelow();
        // $scope.instance.setPopupAbove();
        // adjustPopupOpenDirection();
        
        $scope.$watch('instance.showTree', function() {
            $timeout(function() {
                adjustPopupOpenDirection();
              });
          });

        $scope.setupResizeAndScrollEventListeners = function () {
            var scrollableParents = findScrollParents($scope.instance.getPopup());

            $window.addEventListener('resize', adjustPopupOpenDirection);
            scrollableParents.forEach(function (scrollParent) {
                scrollParent.addEventListener('scroll', adjustPopupOpenDirection, { passive: true });
              });

            return function removeEventListeners() {
                $window.removeEventListener('resize', adjustPopupOpenDirection, { passive: true });
                scrollableParents.forEach(function (scrollParent) {
                  scrollParent.removeEventListener('scroll', adjustPopupOpenDirection, { passive: true });
                });
              };
          };

        // console.log(findScrollParents(document.querySelector('.multi-select-tree__popup-container')));
        // $window.addEventListener('resize', adjustPopupOpenDirection);
      }]);
    
    mainModule.directive('treePopup', 
        function() {
            return {
                restrict: 'E',
                templateUrl: 'src/tree-popup.tpl.html',
                scope: {
                  instance: '='
                },
                controller: 'treePopupCtrl',
                link: function(scope) {

                    var resizeAndScrollListener = {
                        destroy: scope.setupResizeAndScrollEventListeners()
                      };

                    scope.$on('$destroy', function() {
                        resizeAndScrollListener.destroy();
                      });
                  }
              };
          });
  }());