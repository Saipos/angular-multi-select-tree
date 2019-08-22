angular.module('multi-select-tree').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/multi-select-tree.tpl.html',
    "<div class=\"multi-select-tree\" \r" +
    "\n" +
    "    ng-class=\"{\r" +
    "\n" +
    "        'multi-select-tree--input-focused': isInputFocused, \r" +
    "\n" +
    "        'multi-select-tree--popup-opened': showTree, \r" +
    "\n" +
    "        'multi-select-tree--multiple': multiSelect, \r" +
    "\n" +
    "        'multi-select-tree--single': !multiSelect, \r" +
    "\n" +
    "        'multi-select-tree--has-selected-items': selectedItems && selectedItems.length > 0, \r" +
    "\n" +
    "        'multi-select-tree--disabled': disabled,\r" +
    "\n" +
    "        'multi-select-tree--open-above': popupPlacement == 'above',\r" +
    "\n" +
    "        'multi-select-tree--open-below': popupPlacement == 'below'\r" +
    "\n" +
    "    }\">\r" +
    "\n" +
    "    <tree-control instance=\"this\"></tree-control>\r" +
    "\n" +
    "    <tree-popup instance=\"this\"></tree-popup>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('src/multi-value-item.tpl.html',
    "<div class=\"multi-select-tree__multi-value-item\" ng-click=\"onClick($event)\">\r" +
    "\n" +
    "    <span class=\"multi-select-tree__multi-value-item-label\">{{item.name}}</span>\r" +
    "\n" +
    "    <i class=\"multi-select-tree__multi-value-item-remove\"></i>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/single-value.tpl.html',
    "<span class=\"multi-select-tree__single-value\" ng-show=\"!instance.filterKeyword\">{{item.name}}</span>"
  );


  $templateCache.put('src/tree-control.tpl.html',
    "<div class=\"multi-select-tree__control\" ng-click=\"onClick($event)\">\r" +
    "\n" +
    "    <div class=\"multi-select-tree__value-container\">\r" +
    "\n" +
    "        <div ng-class=\"{'multi-select-tree__multi-value-container': instance.multiSelect, 'multi-select-tree__single-value-container': !instance.multiSelect}\">\r" +
    "\n" +
    "            <single-value ng-if=\"!instance.multiSelect\" instance=\"instance\" item=\"instance.selectedItems[0]\"></single-value>\r" +
    "\n" +
    "            <multi-value-item ng-if=\"instance.multiSelect\" ng-repeat=\"selectedItem in instance.selectedItems\" item=\"selectedItem\" instance=\"instance\"></multi-value-item>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <span class=\"multi-select-tree__placeholder\" ng-show=\"!instance.filterKeyword && (!instance.selectedItems || instance.selectedItems.length == 0)\" ng-bind=\"instance.defaultLabel\"></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <tree-filter-input instance=\"instance\"></tree-filter-input>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <button class=\"multi-select-tree__clear-button\" ng-show=\"!instance.disabled && instance.selectedItems.length > 0\" ng-click=\"instance.clearSelection($event)\"></button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <button class=\"multi-select-tree__control-arrow-button\" ng-click=\"instance.togglePopup($event);\"></button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/tree-filter-input.tpl.html',
    "<div class=\"multi-select-tree__input-container\">\r" +
    "\n" +
    "    <input type=\"text\" class=\"multi-select-tree__input\" ng-model=\"instance.filterKeyword\" ng-blur=\"onBlur($event)\" ng-keydown=\"onKeydown($event)\">\r" +
    "\n" +
    "</div>"
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


  $templateCache.put('src/tree-popup.tpl.html',
    "<div class=\"multi-select-tree__popup-container\" ng-show=\"instance.showTree\">\r" +
    "\n" +
    "    <div class=\"multi-select-tree__popup\">\r" +
    "\n" +
    "        <ul class=\"multi-select-tree__list\">\r" +
    "\n" +
    "            <tree-item \r" +
    "\n" +
    "                ng-repeat=\"item in instance.inputModel\" \r" +
    "\n" +
    "                item=\"item\" \r" +
    "\n" +
    "                ng-show=\"!item.isFiltered\"\r" +
    "\n" +
    "                use-callback=\"instance.useCallback\" \r" +
    "\n" +
    "                can-select-item=\"instance.canSelectItem\"\r" +
    "\n" +
    "                multi-select=\"instance.multiSelect\" \r" +
    "\n" +
    "                item-selected=\"instance.itemSelected(item)\"\r" +
    "\n" +
    "                on-active-item=\"instance.onActiveItem(item)\" \r" +
    "\n" +
    "                expand-toggle=\"instance.itemExpandToggle(item)\" \r" +
    "\n" +
    "                select-only-leafs=\"instance.selectOnlyLeafs\">\r" +
    "\n" +
    "            </tree-item>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "        <span class=\"multi-select-tree__no-results-text\" ng-show=\"instance.filterKeyword && instance.totalFilteredItems == 0\">{{instance.noResultsText || 'No results found...'}}</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);
