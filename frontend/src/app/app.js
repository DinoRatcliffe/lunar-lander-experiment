angular.module('EXP', [
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
.constant('APIURL', 'http://localhost:8080');
