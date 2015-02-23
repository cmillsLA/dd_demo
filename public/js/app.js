'use strict';


// Declare app level module which depends on filters, and services
angular.module('dd', [
  'ngRoute',
  'dd.filters',
  'dd.services',
  'dd.directives',
  'dd.controllers'
]).
config(['$routeProvider', function($routeProvider, authenticate) {
  // Authenticated pages.
  $routeProvider.when('/dashboard', {templateUrl: '/views/dashboard.html', controller: 'dashboard', resolve: { auth: function(authenticate, $route) {
    return authenticate.verifyUser($route.current.params.site);
  }}});
  $routeProvider.when('/advertise', {templateUrl: '/views/advertise.html', controller: 'advertise', resolve: { auth: function(authenticate, $route) {
    return authenticate.verifyUser($route.current.params.site);
  }}});
  $routeProvider.when('/category', {templateUrl: '/views/category.html', controller: 'category', resolve: { auth: function(authenticate, $route) {
    return authenticate.verifyUser($route.current.params.site);
  }}});
  $routeProvider.when('/points', {templateUrl: '/views/points.html', controller: 'points', resolve: { auth: function(authenticate, $route) {
    return authenticate.verifyUser($route.current.params.site);
  }}});
  $routeProvider.when('/revenue', {templateUrl: '/views/revenue.html', controller: 'revenue', resolve: { auth: function(authenticate, $route) {
    return authenticate.verifyUser($route.current.params.site);
  }}});
  // Non-authenticated pages.
  $routeProvider.when('/login', {templateUrl: '/views/login.html', controller: 'login'});
  $routeProvider.when('/password', {templateUrl: '/views/password.html', controller: 'password'});
  $routeProvider.when('/activate', {templateUrl: '/views/activate.html', controller: 'activate'});
  $routeProvider.when('/help', {templateUrl: '/views/help.html', controller: 'help'});
  $routeProvider.otherwise({redirectTo: '/login'});
}])
.factory('getUserEmail', ['$rootScope', '$window', '$q', '$location', '$timeout', '$http', function($rootScope, $window, $q, $location, $timeout, $http) {
   return {

     // Get user site access.
     getSites: function(token) {

       var deferred = $q.defer();

       $http({method: 'GET', async: false, crossDomain: true, url: 'someurl/api/verifyUser?token=' + token}).
        success(function(data) {
          $rootScope.sites = data.sites;
          deferred.resolve(data);
       }).error(function(data) {
          deferred.reject(data);
       });

       return deferred.promise;

     }

   }
 }])
.factory('authenticate', ['$rootScope', '$q', '$location', '$http', 'getUserEmail', function($rootScope, $q, $location, $http, getUserEmail) {
  return {

    siteError: function() {
      $location.path('/login');
    },

    // Redirect user to /sites if logged in.
    verifyUser: function() {
      var deferred = $q.defer();

      var _this = this;

      function readCookie(name) {
        console.log(name);
          var nameEQ = name + "=";
          var ca = document.cookie.split(';');
          for(var i=0;i < ca.length;i++) {
              var c = ca[i];
              while (c.charAt(0)==' ') c = c.substring(1,c.length);
              if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
          }
          return null;
      }

      //var token = readCookie('dd.sess');
      var token = 12345;

      if(token) {
        // Ping server to verify user is logged in.
        $.ajax({
          crossOrigin: true,
          type: "GET",
          url: 'someurl/api/verify_login?token=' + token,
          success: function(d) {
            if(d.success == true) {
              deferred.resolve(true);
            } else {
              document.cookie = 'dd.sess=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              deferred.reject(true);
              _this.siteError();
            }
          },
          error: function(d) {
            document.cookie = 'dd.sess=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            deferred.reject(true);
            _this.siteError();
          }
        });
      } else {
        deferred.reject(true);
      }
      deferred.resolve(true);

      return deferred.promise;

    }
  }
}]);