'use strict';

angular.module('dd.directives', []).
  directive('tester', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);