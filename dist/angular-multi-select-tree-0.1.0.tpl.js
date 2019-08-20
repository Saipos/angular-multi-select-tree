angular.module('multi-select-tree').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/multi-select-tree.tpl.html',
    "<div class=\"multi-select-tree\" ng-class=\"{'multi-select-tree--input-focused': isInputFocused, 'multi-select-tree--popup-opened': showTree, 'multi-select-tree--multiple': multiSelect, 'multi-select-tree--single': !multiSelect, 'multi-select-tree--has-selected-items': selectedItems && selectedItems.length > 0, 'multi-select-tree--disabled': disabled}\">\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"multi-select-tree__control\" ng-click=\"onControlClick($event)\">\r" +
    "\n" +
    "        <div class=\"multi-select-tree__value-container\">\r" +
    "\n" +
    "            <div ng-class=\"{'multi-select-tree__multi-value-container': multiSelect, 'multi-select-tree__single-value-container': !multiSelect}\">\r" +
    "\n" +
    "                <span class=\"multi-select-tree__single-value\" ng-if=\"!multiSelect\" ng-show=\"!filterKeyword\">{{selectedItems[0].name}}</span>\r" +
    "\n" +
    "                <div ng-if=\"multiSelect\" class=\"multi-select-tree__multi-value-item\" ng-repeat=\"selectedItem in selectedItems\" ng-click=\"deselectItem(selectedItem, $event)\">\r" +
    "\n" +
    "                    <span class=\"multi-select-tree__multi-value-item-label\">{{selectedItem.name}}</span>\r" +
    "\n" +
    "                    <i class=\"multi-select-tree__multi-value-item-remove\"></i>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <span class=\"multi-select-tree__placeholder\" ng-show=\"!filterKeyword && (!selectedItems || selectedItems.length == 0)\" ng-bind=\"defaultLabel\"></span>\r" +
    "\n" +
    "                <div class=\"multi-select-tree__input-container\">\r" +
    "\n" +
    "                    <input type=\"text\" class=\"multi-select-tree__input\" ng-model=\"filterKeyword\" ng-blur=\"onInputBlur($event)\" ng-keydown=\"onInputKeydown($event)\">\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <button class=\"multi-select-tree__clear-button\" ng-show=\"!disabled && selectedItems.length > 0\" ng-click=\"clearSelection($event)\"></button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <button class=\"multi-select-tree__control-arrow-button\" ng-click=\"togglePopup($event);\"></button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"multi-select-tree__popup-container\" ng-show=\"showTree\">\r" +
    "\n" +
    "        <div class=\"multi-select-tree__popup\">\r" +
    "\n" +
    "            <ul class=\"multi-select-tree__list\">\r" +
    "\n" +
    "                <tree-item ng-repeat=\"item in inputModel\" item=\"item\" ng-show=\"!item.isFiltered\"\r" +
    "\n" +
    "                    use-callback=\"useCallback\" can-select-item=\"canSelectItem\"\r" +
    "\n" +
    "                    multi-select=\"multiSelect\" item-selected=\"itemSelected(item)\"\r" +
    "\n" +
    "                    on-active-item=\"onActiveItem(item)\" expand-toggle=\"itemExpandToggle(item)\" select-only-leafs=\"selectOnlyLeafs\"></tree-item>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "            <span class=\"multi-select-tree__no-results-text\" ng-show=\"filterKeyword && totalFilteredItems == 0\">{{noResultsText || 'No results found...'}}</span>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/tree-item.tpl.html',
    "<li class=\"multi-select-tree__list-item\">\r" +
    "\n" +
    "    <div class=\"multi-select-tree__option\" data-id=\"{{item.id}}\" ng-class=\"{'multi-select-tree__option--active': item.isActive, 'multi-select-tree__option--selected': item.selected, 'multi-select-tree__option--expanded': item.isExpanded, 'multi-select-tree__option--selectable': !selectOnlyLeafs || !item.children || item.children.length == 0}\" ng-mouseover=\"onMouseOver(item, $event)\">\r" +
    "\n" +
    "        <button ng-class=\"{'multi-select-tree__option-arrow--visible': showExpand(item)}\" class=\"multi-select-tree__option-arrow\" ng-click=\"onExpandClicked(item, $event)\"></button>\r" +
    "\n" +
    "        <div class=\"multi-select-tree__label-container item-details\" ng-click=\"clickSelectItem(item, $event)\" >\r" +
    "\n" +
    "            <input class=\"multi-select-tree__checkbox\" type=\"checkbox\" ng-if=\"showCheckbox()\" ng-checked=\"item.selected\"/>\r" +
    "\n" +
    "            {{item.name}}\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <ul class=\"multi-select-tree__list multi-select-tree__list--child\" ng-repeat=\"child in item.children\" ng-if=\"item.isExpanded\">\r" +
    "\n" +
    "        <tree-item item=\"child\" parent-item=\"item\" item-selected=\"subItemSelected(item)\" use-callback=\"useCallback\"\r" +
    "\n" +
    "                   can-select-item=\"canSelectItem\" multi-select=\"multiSelect\" ng-show=\"!child.isFiltered\"\r" +
    "\n" +
    "                   on-active-item=\"activeSubItem(item, $event)\" expand-toggle=\"onSubItemExpandClicked(item)\" select-only-leafs=\"selectOnlyLeafs\"></tree-item>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</li>"
  );

}]);
