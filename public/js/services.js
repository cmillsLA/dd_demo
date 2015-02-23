'use strict';

angular.module('dd.services', []).
  value('version', '0.1').
  service('twitter', ['$rootScope', '$q', '$location', '$http', function($rootScope, $q, $location, $http) {
  return {

    // Redirect user to /sites if logged in.
    verifyUser: function() {
      var deferred = $q.defer();

      var _this = this;

      function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
      }

      var token = readCookie('dd.sess');

      if(token) {
      $('#loader').addClass('ajax');
      $http.get('/api/twitter').
        success(function(d,s,h,c) {
          if(d.success) {
            deferred.resolve(true);
            //deferred.reject(true);
          } else {
            deferred.reject(true);
          }
        }).
        error(function(d,s,h,c) {
          displayErr('twitter', 'error');
          $('#loader').removeClass('ajax');
        });
      }

      $('#loader').removeClass('ajax');

      return deferred.promise;

    }
  }
}]);