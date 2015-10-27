'use strict'
angular.module('EXP')
.service('lunarLanderService', function() {
    var service = {listeners: {}};
    var game;

    function registerListener(id, func) {
        service.listeners[id] = func;
    }

    function unregisterListener(id) {
        delete service.listeners[id];
    }

    function sendEvent(type, data) {
        _.forEach(service.listeners, function(func, id) {
            if (service.listeners.hasOwnProperty(id)) {
                func(type, data);
            }
        });
    }

    function setGame(lunarGame) {
        game = lunarGame;
    }

    function startGame() {
        if (game) {
            game.startGame();
        }
    }

    function pauseGame() {
        if (game) {
            game.pauseGame();
        }
    }

    return {
        NEW_LEVEL: 0,
        NEW_SCORE: 1,
        NEW_LOG: 2, 
        registerListener: registerListener,
        unregisterListener: unregisterListener,
        sendEvent: sendEvent,
        setGame: setGame,
        startGame: startGame,
        pauseGame: pauseGame
    }
});
