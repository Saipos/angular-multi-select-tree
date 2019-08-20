/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var app = angular.module('demoApp', ['multi-select-tree']);

app.controller('demoAppCtrl', function ($scope) {

  var data1 = [];
  var id = 1;
  for (var i = 0; i < 7; i++) {
    var obj = {
      id: id,
      name: 'Node ' + i,
      children: []
    };
    id++;
    for (var j = 0; j < 3; j++) {
      var obj2 = {
        id: id,
        name: 'Node child ' + i + '.' + j,
        children: []
      };
      obj.children.push(obj2);
      id++;
    }

    data1.push(obj);
  }

  data1[1].children[0].children.push({
    id: id,
    name: 'Node sub_sub 1',
    children: [],
    selected: true
  });

  data1[0].selected = true;

  $scope.data = angular.copy(data1);

  $scope.selectOnly1Or2 = function(item, selectedItems) {
    if (selectedItems  !== undefined && selectedItems.length >= 20) {
      return false;
    } else {
      return true;
    }
  };
});