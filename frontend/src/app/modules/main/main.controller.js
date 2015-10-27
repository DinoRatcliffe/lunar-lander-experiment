(function() {
    'use strict';

    angular.module('EXP')
    .config(function($stateProvider) {
        $stateProvider.state('root.main', {
            url: '/',
            authenticate: true,
            templateUrl: 'modules/main/main.html',
            controller: 'MainCtrl'
        });
    })
    .controller('MainCtrl', function($scope, $mdDialog, $rootScope, User, lunarLanderService, ipCookie) {
        $scope.loading = true;
        var token = ipCookie('api_token');

        if (!token) {
            User.init({}, function(user) {
                $rootScope.currentUser = user;
                ipCookie('api_token', user.id, { expires: 21 });
                init();
            });
        } else {
            User.get({id: ipCookie('api_token')}, function(user) {
                if (user) {
                    $rootScope.currentUser = user;
                    if ($rootScope.currentUser.revisits) {
                        $rootScope.currentUser.revisits++;
                    } else {
                        $rootScope.currentUser.revisits = 1;
                    }
                    ipCookie('api_token', user.id, { expires: 21 });
                    User.update($rootScope.currentUser);
                    init();
                } else {
                    User.init({}, function(user) {
                        $rootScope.currentUser = user;
                        ipCookie('api_token', user.id, { expires: 21 });
                        init();
                    });
                }
            }, function(error) {
                User.init({}, function(user) {
                    $rootScope.currentUser = user;
                    ipCookie('api_token', user.id, { expires: 21 });
                    init();
                });
            });
        }

        function init() {
            $scope.loading = false;
            $scope.playing = false;
            $scope.difficulty = $rootScope.currentUser.difficulty;
            $scope.user = $rootScope.currentUser;
            if (!$rootScope.currentUser.score) {
                $rootScope.currentUser.score = 0;
            }
            if (!$rootScope.currentUser.playTime) {
                $rootScope.currentUser.playTime = 0;
            }
            if (!$rootScope.currentUser.currentLevel) {
                $rootScope.currentUser.currentLevel = {
                    number: 1,
                    width: 100,
                    distance: 100,
                    deaths: 0,
                    attempts: []
                }
            }
            if (!$rootScope.currentUser.score) {
                $rootScope.currentUser.score = 0;
            }
            if (!$rootScope.currentUser || !$rootScope.currentUser.consent) {
                //present consent
                performConsent();
            } else {
                //present game
                $scope.consentGiven = true;
                showInstructions();
            }

            function performConsent() {
                var confirm = $mdDialog.confirm()
                .title('Participation Consent')
                .content(
                    '<ul><li>As part of this experiment you will play a space landing game</li><li>This is part of an experiment into how people play games</li><li>You must be 18 or older to take part in this experiment</li><li>Data about how you play the game will be gathered throughout the course of you playing the game</li><li>You may at anypoint exit the experiment</li><li>If you would like the data gathered to be deleted or not used then please email dratcl@essex.ac.uk with this ID: <b><i>' + $rootScope.currentUser.id + '</i></b></li></ul>'
                )
                .ariaLabel('Paricipaiton Consent')
                .ok('I Agree');

                $mdDialog.show(confirm).then(function() {
                    $scope.consentGiven = true;
                    User.update({consent: true, id: $rootScope.currentUser.id})
                    showInstructions();
                });
            };

            function showInstructions() {
                var instructions = $mdDialog.confirm()
                .title('Instructions')
                .content(
                    'The aim of the game is to land the ship upright on the white platform. <br/>To rotate the ship use the left and right arrow keys and to use the thrusters use the up arrow key.<br/>Your score will be based on how upright the ship is, how hard you land and how much fuel you have left' 
                )
                .ariaLabel('Instructions')
                .ok('Start');

                $mdDialog.show(instructions).then(function() {
                    lunarLanderService.startGame();
                    $scope.playing = true;
                });
            }

            lunarLanderService.registerListener('mainCtrl', function(type, data) {
                switch(type) {
                    case lunarLanderService.NEW_LEVEL:
                        if (!$rootScope.currentUser.levels) {
                            $rootScope.currentUser.levels = {};
                        }
                        var oldLevel = $rootScope.currentUser.currentLevel;

                        $rootScope.currentUser.levels[oldLevel.number] = oldLevel;
                        $rootScope.currentUser.currentLevel = data;
                        $rootScope.currentUser.playTime += oldLevel.playTime;
                        User.update($rootScope.currentUser);
                        break;
                    case lunarLanderService.NEW_SCORE:
                        $rootScope.currentUser.score = data;
                        break;
                    case lunarLanderService.NEW_LOG:
                        $rootScope.currentUser.currentLevel = data;
                        User.update($rootScope.currentUser);
                        break;
                }
            });

            $scope.startGame = function() {
                if ($scope.consentGiven) {
                    //startGame
                    lunarLanderService.startGame();
                    $scope.playing = true;
                } else {
                    performConsent();
                }
            }
        }
    });
}());
