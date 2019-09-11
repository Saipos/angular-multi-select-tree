/*jshint indent: 2 */
/*global angular: false */

(function () {

  'use strict';
  var mainModule = angular.module('multi-select-tree');

  /**
   * Controller for multi select tree.
   */
  mainModule.controller('multiSelectTreeCtrl', ['$scope', '$document', '$element', function ($scope, $document, $element) {

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
      if (!itemElement) return false;
      var popupElement = $scope.getPopup();
      var popupRect = popupElement.getBoundingClientRect();
      var itemRect = itemElement.getBoundingClientRect();
      var overScroll = itemElement.offsetHeight / 3;
      if (itemRect.bottom + overScroll > popupRect.bottom) {
        var newTop = Math.min(
          itemElement.offsetTop + itemElement.clientHeight - popupElement.offsetHeight + overScroll,
          popupElement.scrollHeight
        );
        popupElement.scrollTop = newTop;
      } else if (itemRect.top - overScroll < popupRect.top) {
        popupElement.scrollTop = Math.max(itemElement.offsetTop - overScroll, 0);
      }
    }

    $scope.openPopup = function () {
      if ($scope.disabled) return;
      $scope.showTree = true;
      if (!$scope.activeItem)
        $scope.activeFirstItem();
      $document.on('click', docClickHide);
    };

    $scope.closePopup = function() {
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
        return $scope.onActiveItem($scope.getItemAt(visibleItemsLength-1));
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
      if ($scope.disabled) return;
      $scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
      item.selected = false;
      this.refreshOutputModel();
    };

    $scope.clearSelection = function ($event) {
      $event.stopPropagation();
      if ($scope.disabled) return;
      angular.forEach($scope.selectedItems, function(item) {
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

    $scope.onInputBlur = function($event) {
      $scope.isInputFocused = false;
    };

    $scope.getInput = function () {
      return this.getValueContainer().querySelector('.multi-select-tree__input');
    };

    $scope.focusInput = function() {
      $scope.isInputFocused = true;
      this.getInput().focus();
    };

    $scope.togglePopup = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      if ($scope.disabled) return;
      if ($scope.showTree) $scope.closePopup();
      else $scope.openPopup();
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
      return $scope.callback({item: item, selectedItems: $scope.selectedItems});
    };
    
    /**
     * Handles the item select event.
     *
     * @param item the selected item.
     */
    $scope.itemSelected = function (item) {
      if (($scope.useCallback && $scope.canSelectItem(item) === false) ||
        ($scope.selectOnlyLeafs && item.children && item.children.length > 0)) {
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
      $scope.visibleItems = getAllVisibleNodes({children: $scope.inputModel}, []);
    };

    function setPopupPlacement (placement) {
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

  }]);

  /**
   * sortableItem directive.
   */
  mainModule.directive('multiSelectTree',
    function () {
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
          noResultsText: '@',
          ngDisabled: '=?'
        },
        link: function (scope, element, attrs) {
          if (attrs.callback) {
            scope.useCallback = true;
          }

          if (attrs.tabindex) {
            scope.tabindex = attrs.tabindex;
            element[0].removeAttribute('tabindex');
          }

          scope.$watch('ngDisabled', function() {
            scope.disabled = scope.ngDisabled;
          });

          // watch for changes in input model as a whole
          // this on updates the multi-select when a user load a whole new input-model.
          scope.$watch('inputModel', function (newVal) {
            if (newVal) {
              scope.refreshSelectedItems();
              scope.refreshOutputModel();
              scope.resetVisibleNodes();
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

            function focusEventListener() {
              scope.focusInput();
            }

            element[0].addEventListener('focus', focusEventListener);

            scope.$on('$destroy', function() {
              element[0].removeEventListener('focus', focusEventListener);
            });
          });
        },
        controller: 'multiSelectTreeCtrl'
      };
    });
}());