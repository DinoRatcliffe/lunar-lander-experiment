angular.module('abyork', [
  'ui.router',
  'ngMaterial',
  'ngResource',
  'ipCookie'
])
.config(function ($urlRouterProvider) {
  'use strict';
  $urlRouterProvider.otherwise('/');
})
.run(function($rootScope, User, $window, APIURL, ipCookie) {
    'use strict';
    $rootScope.currentUser = '';
})
//TODO change at production build step
.constant('APIURL', 'http://192.168.99.100:8080');
