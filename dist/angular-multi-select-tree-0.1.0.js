/*
 The MIT License (MIT)

 Copyright (c) 2014 Muhammed Ashik

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
/*jshint indent: 2 */
/*global angular: false */
(function () {
  'use strict';
  angular.module('multi-select-tree', []);
}());
/*jshint indent: 2 */
/*global angular: false */
(function () {
  'use strict';
  var mainModule = angular.module('multi-select-tree');
  /**
   * Controller for multi select tree.
   */
  mainModule.controller('multiSelectTreeCtrl', [
    '$scope',
    '$document',
    '$element',
    function ($scope, $document, $element) {
      var _currentSequentialId = 0;
      $scope.showTree = false;
      $scope.selectedItems = [];
      $scope.visibleItems = [];
      $scope.multiSelect = $scope.multiSelect || false;
      $scope.filterKeyword = '';
      $scope.activeItem = null;
      $scope.popupPlacement = 'below';
      /**
     * Clicking on document will hide the tree.
     */
      function docClickHide($event) {
        var valueContainerClicked = $scope.getValueContainer().contains($event.target);
        if (!valueContainerClicked) {
          $scope.closePopup();
          $scope.$apply();
        }
      }
      function getAllVisibleNodes(node, childNodes) {
        if (node.children) {
          var children = node.children.filter(function (child) {
              return !child.isFiltered;
            });
          for (var i = 0; i < children.length; i++) {
            childNodes.push(children[i]);
            // add the childNodes from the children if available
            if (children[i].isExpanded)
              getAllVisibleNodes(children[i], childNodes);
          }
        }
        return childNodes;
      }
      /**
     * Iterates over children and sets the selected items.
     *
     * @param children the children element.
     */
      function setSelectedChildren(children) {
        for (var i = 0, len = children.length; i < len; i++) {
          if (!isItemSelected(children[i]) && children[i].selected === true) {
            $scope.selectedItems.push(children[i]);
          } else if (isItemSelected(children[i]) && children[i].selected === false) {
            children[i].selected = true;
          }
          if (children[i] && children[i].children) {
            setSelectedChildren(children[i].children);
          }
        }
      }
      /**
     * Checks of the item is already selected.
     *
     * @param item the item to be checked.
     * @return {boolean} if the item is already selected.
     */
      function isItemSelected(item) {
        var isSelected = false;
        if ($scope.selectedItems) {
          for (var i = 0; i < $scope.selectedItems.length; i++) {
            if ($scope.selectedItems[i].id === item.id) {
              isSelected = true;
              break;
            }
          }
        }
        return isSelected;
      }
      function scrollPopupToItem(item) {
        var itemElement = $scope.getItemElement(item);
        if (!itemElement)
          return false;
        var popupElement = $scope.getPopup();
        var popupRect = popupElement.getBoundingClientRect();
        var itemRect = itemElement.getBoundingClientRect();
        var overScroll = itemElement.offsetHeight / 3;
        if (itemRect.bottom + overScroll > popupRect.bottom) {
          var newTop = Math.min(itemElement.offsetTop + itemElement.clientHeight - popupElement.offsetHeight + overScroll, popupElement.scrollHeight);
          popupElement.scrollTop = newTop;
        } else if (itemRect.top - overScroll < popupRect.top) {
          popupElement.scrollTop = Math.max(itemElement.offsetTop - overScroll, 0);
        }
      }
      $scope.openPopup = function () {
        if ($scope.disabled)
          return;
        $scope.showTree = true;
        if (!$scope.activeItem)
          $scope.activeFirstItem();
        $document.on('click', docClickHide);
      };
      $scope.closePopup = function () {
        $scope.showTree = false;
        $scope.filterKeyword = '';
        if ($scope.activeItem) {
          $scope.activeItem.isActive = false;
          $scope.activeItem = undefined;
        }
        $document.off('click', docClickHide);
      };
      $scope.getItemIndex = function (item_id) {
        for (var index = 0; index < $scope.visibleItems.length; index++) {
          if (item_id === $scope.visibleItems[index].id)
            return index;
        }
        return -1;
      };
      $scope.getActiveItemIndex = function () {
        return $scope.activeItem ? $scope.getItemIndex($scope.activeItem.id) : -1;
      };
      $scope.getItemAt = function (item_index) {
        return $scope.visibleItems[item_index];
      };
      $scope.activeFirstItem = function () {
        if ($scope.visibleItems.length > 0)
          return $scope.onActiveItem($scope.getItemAt(0));
        return false;
      };
      $scope.activeLastItem = function () {
        var visibleItemsLength = $scope.visibleItems.length;
        if (visibleItemsLength > 0)
          return $scope.onActiveItem($scope.getItemAt(visibleItemsLength - 1));
        return false;
      };
      $scope.activeNextItem = function () {
        var next = $scope.getActiveItemIndex() + 1;
        if (next === $scope.visibleItems.length)
          return $scope.activeFirstItem();
        return $scope.onActiveItem($scope.getItemAt(next));
      };
      $scope.activePreviousItem = function () {
        var previous = $scope.getActiveItemIndex() - 1;
        if (previous === -1)
          return $scope.activeLastItem();
        return $scope.onActiveItem($scope.getItemAt(previous));
      };
      $scope.removeLastSelected = function () {
        var length = !$scope.selectedItems ? 0 : $scope.selectedItems.length;
        var last = length ? $scope.selectedItems[length - 1] : undefined;
        if (last) {
          $scope.deselectItem(last);
        }
      };
      /**
     * Sets the active item.
     *
     * @param item the item element.
     */
      $scope.onActiveItem = function (item) {
        if ($scope.activeItem !== item) {
          if ($scope.activeItem) {
            $scope.activeItem.isActive = false;
          }
          $scope.activeItem = item;
          $scope.activeItem.isActive = true;
        }
        scrollPopupToItem($scope.activeItem);
      };
      $scope.itemExpandToggle = function (item) {
        item.isExpanded = !item.isExpanded;
        this.focusInput();
        $scope.resetVisibleNodes();
      };
      /**
     * Copies the selectedItems in to output model.
     */
      $scope.refreshOutputModel = function () {
        $scope.outputModel = angular.copy($scope.selectedItems);
      };
      /**
     * Refreshes the selected Items model.
     */
      $scope.refreshSelectedItems = function () {
        $scope.selectedItems = [];
        if ($scope.inputModel) {
          setSelectedChildren($scope.inputModel);
        }
      };
      /**
     * Deselect the item.
     *
     * @param item the item element
     * @param $event
     */
      $scope.deselectItem = function (item) {
        // $event.stopPropagation();
        if ($scope.disabled)
          return;
        $scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
        item.selected = false;
        this.refreshOutputModel();
      };
      $scope.clearSelection = function ($event) {
        $event.stopPropagation();
        if ($scope.disabled)
          return;
        angular.forEach($scope.selectedItems, function (item) {
          item.selected = false;
        });
        $scope.selectedItems = [];
        $scope.refreshOutputModel();
      };
      $scope.getItemElement = function (item) {
        return $element[0].querySelector('.multi-select-tree__option[data-id="' + item.id + '"]');
      };
      $scope.getPopup = function () {
        return $element[0].querySelector('.multi-select-tree__popup');
      };
      $scope.getControl = function () {
        return $element[0].querySelector('.multi-select-tree__control');
      };
      $scope.getValueContainer = function () {
        return $element[0].querySelector('.multi-select-tree__value-container');
      };
      $scope.onInputBlur = function ($event) {
        $scope.isInputFocused = false;
      };
      $scope.getInput = function () {
        return this.getValueContainer().querySelector('.multi-select-tree__input');
      };
      $scope.focusInput = function () {
        $scope.isInputFocused = true;
        this.getInput().focus();
      };
      $scope.togglePopup = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.disabled)
          return;
        if ($scope.showTree)
          $scope.closePopup();
        else
          $scope.openPopup();
        this.focusInput();
      };
      /**
     * Stop the event on filter clicked.
     *
     * @param $event the click event
     */
      $scope.onFilterClicked = function ($event) {
        $event.stopPropagation();
      };
      /**
     * Clears the filter text.
     *
     * @param $event the click event
     */
      $scope.clearFilter = function () {
        $scope.filterKeyword = '';
      };
      /**
     * Wrapper function for can select item callback.
     *
     * @param item the item
     */
      $scope.canSelectItem = function (item) {
        return $scope.callback({
          item: item,
          selectedItems: $scope.selectedItems
        });
      };
      /**
     * Handles the item select event.
     *
     * @param item the selected item.
     */
      $scope.itemSelected = function (item) {
        if ($scope.useCallback && $scope.canSelectItem(item) === false || $scope.selectOnlyLeafs && item.children && item.children.length > 0) {
          $scope.itemExpandToggle(item);
          return;
        }
        if (!$scope.multiSelect) {
          $scope.closePopup();
          for (var i = 0; i < $scope.selectedItems.length; i++) {
            $scope.selectedItems[i].selected = false;
          }
          item.selected = true;
          $scope.selectedItems = [];
          $scope.selectedItems.push(item);
        } else {
          item.selected = true;
          var indexOfItem = $scope.selectedItems.indexOf(item);
          if (isItemSelected(item)) {
            item.selected = false;
            $scope.selectedItems.splice(indexOfItem, 1);
          } else {
            $scope.selectedItems.push(item);
          }
        }
        this.focusInput();
        this.refreshOutputModel();
      };
      $scope.resetVisibleNodes = function () {
        $scope.visibleItems = getAllVisibleNodes({ children: $scope.inputModel }, []);
      };
      function setPopupPlacement(placement) {
        $scope.popupPlacement = placement;
      }
      $scope.setPopupAbove = function () {
        setPopupPlacement('above');
      };
      $scope.setPopupBelow = function () {
        setPopupPlacement('below');
      };
      $scope.generateItemId = function () {
        return _currentSequentialId++;
      };
    }
  ]);
  /**
   * sortableItem directive.
   */
  mainModule.directive('multiSelectTree', function () {
    return {
      restrict: 'E',
      templateUrl: 'src/multi-select-tree.tpl.html',
      scope: {
        inputModel: '=',
        outputModel: '=?',
        multiSelect: '=?',
        selectOnlyLeafs: '=?',
        callback: '&',
        defaultLabel: '@',
        noResultsText: '@'
      },
      link: function (scope, element, attrs) {
        if (attrs.callback) {
          scope.useCallback = true;
        }
        if (typeof attrs.disabled !== 'undefined') {
          scope.disabled = true;
        }
        // watch for changes in input model as a whole
        // this on updates the multi-select when a user load a whole new input-model.
        scope.$watch('inputModel', function (newVal) {
          if (newVal) {
            scope.refreshSelectedItems();
            scope.refreshOutputModel();
          }
        });
        /**
           * Checks whether any of children match the keyword.
           *
           * @param item the parent item
           * @param keyword the filter keyword
           * @returns {boolean} false if matches.
           */
        function isChildrenFiltered(item, keyword) {
          var childNodes = item.children || [];
          var filteredChildrenLength = 0;
          for (var i = 0, len = childNodes.length; i < len; i++) {
            childNodes[i].isFiltered = keyword.length > 0;
            if (!isChildrenFiltered(childNodes[i], keyword) || childNodes[i].name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
              childNodes[i].isFiltered = false;
              childNodes[i].isExpanded = keyword.length > 0;
              filteredChildrenLength++;
            }
          }
          return filteredChildrenLength === 0;
        }
        scope.$watch('filterKeyword', function () {
          scope.totalFilteredItems = 0;
          if (scope.filterKeyword !== undefined) {
            angular.forEach(scope.inputModel, function (item) {
              item.isExpanded = false;
              if (!isChildrenFiltered(item, scope.filterKeyword) || item.name.toLowerCase().indexOf(scope.filterKeyword.toLowerCase()) !== -1) {
                item.isFiltered = false;
              } else {
                item.isFiltered = true;
              }
              if (!item.isFiltered) {
                scope.totalFilteredItems++;
                item.isExpanded = scope.filterKeyword.length > 0;
              }
            });
          }
          scope.resetVisibleNodes();
        });
      },
      controller: 'multiSelectTreeCtrl'
    };
  });
}());
/*jshint indent: 2 */
/*global angular: false */
(function () {
  'use strict';
  var mainModule = angular.module('multi-select-tree');
  mainModule.controller('multiValueItemCtrl', [
    '$scope',
    function ($scope) {
      $scope.onClick = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.instance.deselectItem($scope.item);
      };
    }
  ]);
  mainModule.directive('multiValueItem', function () {
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
/*jshint indent: 2 */
/*global angular: false */
(function () {
  'use strict';
  var mainModule = angular.module('multi-select-tree');
  mainModule.directive('singleValue', function () {
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
/*jshint indent: 2 */
/*global angular: false */
(function () {
  'use strict';
  var mainModule = angular.module('multi-select-tree');
  mainModule.controller('treeControlCtrl', [
    '$scope',
    function ($scope) {
      $scope.onClick = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.instance.disabled)
          return;
        var valueContainerClicked = $scope.instance.getValueContainer().contains($event.target);
        if (valueContainerClicked && !$scope.instance.showTree)
          $scope.instance.openPopup();
        $scope.instance.focusInput();
      };
    }
  ]);
  mainModule.directive('treeControl', function () {
    return {
      restrict: 'E',
      templateUrl: 'src/tree-control.tpl.html',
      controller: 'treeControlCtrl',
      scope: { instance: '=' }
    };
  });
}());
/*jshint indent: 2 */
/*global angular: false */
(function () {
  'use strict';
  var mainModule = angular.module('multi-select-tree');
  mainModule.controller('treeFilterInputCtrl', [
    '$scope',
    function ($scope) {
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
      $scope.onKeydown = function ($event) {
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
    }
  ]);
  mainModule.directive('treeFilterInput', function () {
    return {
      restrict: 'E',
      templateUrl: 'src/tree-filter-input.tpl.html',
      controller: 'treeFilterInputCtrl',
      scope: { instance: '=' }
    };
  });
}());
/*jshint indent: 2 */
/*global angular: false */
(function () {
  'use strict';
  var mainModule = angular.module('multi-select-tree');
  /**
   * Controller for sortable item.
   *
   * @param $scope - drag item scope
   */
  mainModule.controller('treeItemCtrl', [
    '$scope',
    function ($scope) {
      if (typeof $scope.item.isExpanded !== 'boolean')
        $scope.item.isExpanded = false;
      if (!$scope.item.id)
        $scope.item.id = $scope.generateItemId();
      if ($scope.parentItem)
        $scope.item.parent_id = $scope.parentItem.id;
      /**
     * Shows the expand option.
     *
     * @param item the item
     * @returns {*|boolean}
     */
      $scope.showExpand = function (item) {
        return item.children && item.children.length > 0;
      };
      /**
     * On expand clicked toggle the option.
     *
     * @param item the item
     * @param $event
     */
      $scope.onExpandClicked = function (item, $event) {
        $event.stopPropagation();
        if ($scope.expandToggle) {
          $scope.expandToggle({ item: item });
        }
      };
      $scope.onSubItemExpandClicked = function (item, $event) {
        if ($scope.expandToggle) {
          $scope.expandToggle({ item: item });
        }
      };
      /**
     * Event on click of select item.
     *
     * @param item the item
     * @param $event
     */
      $scope.clickSelectItem = function (item, $event) {
        $event.stopPropagation();
        if ($scope.itemSelected) {
          $scope.itemSelected({ item: item });
        }
      };
      /**
     * Is leaf selected.
     *
     * @param item the item
     * @param $event
     */
      $scope.subItemSelected = function (item, $event) {
        if ($scope.itemSelected) {
          $scope.itemSelected({ item: item });
        }
      };
      /**
     * Active sub item.
     *
     * @param item the item
     * @param $event
     */
      $scope.activeSubItem = function (item, $event) {
        if ($scope.onActiveItem) {
          $scope.onActiveItem({ item: item });
        }
      };
      /**
     * On mouse over event.
     *
     * @param item the item
     * @param $event
     */
      $scope.onMouseOver = function (item, $event) {
        $event.stopPropagation();
        if ($scope.onActiveItem) {
          $scope.onActiveItem({ item: item });
        }
      };
      /**
     * Can select item.
     *
     * @returns {*}
     */
      $scope.showCheckbox = function () {
        if (!$scope.multiSelect) {
          return false;
        }
        if ($scope.selectOnlyLeafs) {
          return false;
        }
        if ($scope.useCallback) {
          return $scope.canSelectItem($scope.item);
        }
        return true;
      };
    }
  ]);
  /**
   * sortableItem directive.
   */
  mainModule.directive('treeItem', [
    '$compile',
    function ($compile) {
      return {
        restrict: 'E',
        templateUrl: 'src/tree-item.tpl.html',
        scope: {
          item: '=',
          parentItem: '=',
          itemSelected: '&',
          onActiveItem: '&',
          expandToggle: '&',
          generateItemId: '&',
          multiSelect: '=?',
          selectOnlyLeafs: '=?',
          isActive: '=',
          useCallback: '=',
          canSelectItem: '='
        },
        controller: 'treeItemCtrl',
        compile: function (element, attrs, link) {
          // Normalize the link parameter
          if (angular.isFunction(link)) {
            link = { post: link };
          }
          // Break the recursion loop by removing the contents
          var contents = element.contents().remove();
          var compiledContents;
          return {
            pre: link && link.pre ? link.pre : null,
            post: function (scope, element, attrs) {
              // Compile the contents
              if (!compiledContents) {
                compiledContents = $compile(contents);
              }
              // Re-add the compiled contents to the element
              compiledContents(scope, function (clone) {
                element.append(clone);
              });
              // Call the post-linking function, if any
              if (link && link.post) {
                link.post.apply(null, arguments);
              }
            }
          };
        }
      };
    }
  ]);
}());
/*jshint indent: 2 */
/*global angular: false */
(function () {
  'use strict';
  var mainModule = angular.module('multi-select-tree');
  mainModule.controller('treePopupCtrl', [
    '$scope',
    '$timeout',
    '$window',
    function ($scope, $timeout, $window) {
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
        return /(auto|scroll|overlay)/.test(elementStyle.overflow + elementStyle.overflowY + elementStyle.overflowX);
      }
      function adjustPopupOpenDirection() {
        if (!$scope.instance.showTree)
          return;
        var popupElement = $scope.instance.getPopup();
        var controlElement = $scope.instance.getControl();
        var popupRect = popupElement.getBoundingClientRect();
        var controlRect = controlElement.getBoundingClientRect();
        var spaceAbove = controlRect.top;
        var spaceBelow = $window.innerHeight - controlRect.bottom;
        var isControlInViewport = controlRect.top >= 0 && controlRect.top <= $window.innerHeight || controlRect.top < 0 && controlRect.bottom > 0;
        var hasEnoughSpaceBelow = spaceBelow > popupRect.height;
        // + MENU_BUFFER;
        var hasEnoughSpaceAbove = spaceAbove > popupRect.height;
        // + MENU_BUFFER;
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
      $scope.$watch('instance.showTree', function () {
        $timeout(function () {
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
      };  // console.log(findScrollParents(document.querySelector('.multi-select-tree__popup-container')));
          // $window.addEventListener('resize', adjustPopupOpenDirection);
    }
  ]);
  mainModule.directive('treePopup', function () {
    return {
      restrict: 'E',
      templateUrl: 'src/tree-popup.tpl.html',
      scope: { instance: '=' },
      controller: 'treePopupCtrl',
      link: function (scope) {
        var resizeAndScrollListener = { destroy: scope.setupResizeAndScrollEventListeners() };
        scope.$on('$destroy', function () {
          resizeAndScrollListener.destroy();
        });
      }
    };
  });
}());