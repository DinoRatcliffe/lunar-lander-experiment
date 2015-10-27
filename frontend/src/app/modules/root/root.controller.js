(function() {
    'use strict';

    angular.module('EXP')
    .config(function($stateProvider) {
        $stateProvider.state('root', {
            abstract: true,
            templateUrl: 'modules/root/root.html',
            controller: 'RootCtrl'
        });
    })
    .controller('RootCtrl', function($rootScope) {
    });

}());
