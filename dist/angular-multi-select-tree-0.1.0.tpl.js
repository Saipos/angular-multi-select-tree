angular.module('multi-select-tree').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/multi-select-tree.tpl.html',
    "<div class=\"multi-select-tree\" \n" +
    "    ng-class=\"{\n" +
    "        'multi-select-tree--input-focused': isInputFocused, \n" +
    "        'multi-select-tree--popup-opened': showTree, \n" +
    "        'multi-select-tree--multiple': multiSelect, \n" +
    "        'multi-select-tree--single': !multiSelect, \n" +
    "        'multi-select-tree--has-selected-items': selectedItems && selectedItems.length > 0, \n" +
    "        'multi-select-tree--disabled': disabled,\n" +
    "        'multi-select-tree--open-above': popupPlacement == 'above',\n" +
    "        'multi-select-tree--open-below': popupPlacement == 'below'\n" +
    "    }\">\n" +
    "    <tree-control instance=\"this\"></tree-control>\n" +
    "    <tree-popup instance=\"this\"></tree-popup>\n" +
    "</div>\n"
  );


  $templateCache.put('src/multi-value-item.tpl.html',
    "<div class=\"multi-select-tree__multi-value-item\" ng-click=\"onClick($event)\">\n" +
    "    <span class=\"multi-select-tree__multi-value-item-label\">{{item.name}}</span>\n" +
    "    <i ng-show=\"!instance.disabled\" class=\"multi-select-tree__multi-value-item-remove\"></i>\n" +
    "</div>"
  );


  $templateCache.put('src/single-value.tpl.html',
    "<span class=\"multi-select-tree__single-value\" ng-show=\"!instance.filterKeyword\">{{item.name}}</span>"
  );


  $templateCache.put('src/tree-control.tpl.html',
    "<div class=\"multi-select-tree__control\" ng-click=\"onClick($event)\">\n" +
    "    <div class=\"multi-select-tree__value-container\">\n" +
    "        <div ng-class=\"{'multi-select-tree__multi-value-container': instance.multiSelect, 'multi-select-tree__single-value-container': !instance.multiSelect}\">\n" +
    "            <single-value ng-if=\"!instance.multiSelect\" instance=\"instance\" item=\"instance.selectedItems[0]\"></single-value>\n" +
    "            <multi-value-item ng-if=\"instance.multiSelect\" ng-repeat=\"selectedItem in instance.selectedItems\" item=\"selectedItem\" instance=\"instance\"></multi-value-item>\n" +
    "\n" +
    "            <span class=\"multi-select-tree__placeholder\" ng-show=\"!instance.filterKeyword && (!instance.selectedItems || instance.selectedItems.length == 0)\" ng-bind=\"instance.defaultLabel\"></span>\n" +
    "\n" +
    "            <tree-filter-input instance=\"instance\"></tree-filter-input>\n" +
    "            \n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <button class=\"multi-select-tree__clear-button\" ng-show=\"!instance.disabled && instance.selectedItems.length > 0\" tabindex=\"-1\" ng-click=\"instance.clearSelection($event)\"></button>\n" +
    "\n" +
    "    <button class=\"multi-select-tree__control-arrow-button\" ng-click=\"instance.togglePopup($event);\" tabindex=\"-1\"></button>\n" +
    "</div>"
  );


  $templateCache.put('src/tree-filter-input.tpl.html',
    "<div class=\"multi-select-tree__input-container\">\n" +
    "    <input type=\"text\" ng-disabled=\"instance.disabled\" ng-attr-tabindex=\"{{instance.tabindex || undefined}}\" class=\"multi-select-tree__input\" ng-model=\"instance.filterKeyword\" ng-blur=\"onBlur($event)\" ng-keydown=\"onKeydown($event)\">\n" +
    "</div>"
  );


  $templateCache.put('src/tree-item.tpl.html',
    "<li class=\"multi-select-tree__list-item\">\n" +
    "    <div class=\"multi-select-tree__option\" data-id=\"{{item.id}}\" ng-class=\"{'multi-select-tree__option--active': item.isActive, 'multi-select-tree__option--selected': item.selected, 'multi-select-tree__option--expanded': item.isExpanded, 'multi-select-tree__option--selectable': !selectOnlyLeafs || !item.children || item.children.length == 0}\" ng-mouseover=\"onMouseOver(item, $event)\">\n" +
    "        <button ng-class=\"{'multi-select-tree__option-arrow--visible': showExpand(item)}\" class=\"multi-select-tree__option-arrow\" ng-click=\"onExpandClicked(item, $event)\"></button>\n" +
    "        <div class=\"multi-select-tree__label-container item-details\" ng-click=\"clickSelectItem(item, $event)\" >\n" +
    "            <input class=\"multi-select-tree__checkbox\" type=\"checkbox\" ng-if=\"showCheckbox()\" ng-checked=\"item.selected\"/>\n" +
    "            {{item.name}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <ul class=\"multi-select-tree__list multi-select-tree__list--child\" ng-repeat=\"child in item.children\" ng-if=\"item.isExpanded\">\n" +
    "        <tree-item item=\"child\" parent-item=\"item\" item-selected=\"subItemSelected(item)\" use-callback=\"useCallback\"\n" +
    "                   can-select-item=\"canSelectItem\" multi-select=\"multiSelect\" ng-show=\"!child.isFiltered\"\n" +
    "                   on-active-item=\"activeSubItem(item, $event)\" expand-toggle=\"onSubItemExpandClicked(item)\" select-only-leafs=\"selectOnlyLeafs\"></tree-item>\n" +
    "    </ul>\n" +
    "</li>"
  );


  $templateCache.put('src/tree-popup.tpl.html',
    "<div class=\"multi-select-tree__popup-container\" ng-show=\"instance.showTree\">\n" +
    "    <div class=\"multi-select-tree__popup\">\n" +
    "        <ul class=\"multi-select-tree__list\">\n" +
    "            <tree-item \n" +
    "                ng-repeat=\"item in instance.inputModel\" \n" +
    "                item=\"item\" \n" +
    "                ng-show=\"!item.isFiltered\"\n" +
    "                use-callback=\"instance.useCallback\" \n" +
    "                can-select-item=\"instance.canSelectItem\"\n" +
    "                multi-select=\"instance.multiSelect\" \n" +
    "                item-selected=\"instance.itemSelected(item)\"\n" +
    "                on-active-item=\"instance.onActiveItem(item)\" \n" +
    "                expand-toggle=\"instance.itemExpandToggle(item)\" \n" +
    "                select-only-leafs=\"instance.selectOnlyLeafs\"\n" +
    "                generate-item-id=\"instance.generateItemId()\">\n" +
    "            </tree-item>\n" +
    "        </ul>\n" +
    "        <span class=\"multi-select-tree__no-results-text\" ng-show=\"instance.filterKeyword && instance.totalFilteredItems == 0\">{{instance.noResultsText || 'No results found...'}}</span>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
