'use strict';

var elasticsearch = require('elasticsearch');
var config = require('../config');

// Allow delay of server start in order to allow elasticsearch to init, docker-compose limitation!
if (process.env.DECKARD_DELAY_START) {
    var waitTime = process.env.DECKARD_DELAY_START;
    var date = new Date();
    var curDate = null;
    do {
        curDate = new Date();
    } while (curDate-date < waitTime);
}


while(waitTime > 0) {
    waitTime--;
}
var client = new elasticsearch.Client({
    host: config.elasticsearch.host + ":" + config.elasticsearch.port
});
var indexEnsured = false;
var mappingComplete = 0;
var mapping = [];

exports.ensureIndex = function() {
    client.indices.exists(
        {index: 'lunarl'},
        function(err, value) {
            if (!value) {
                client.indices.create({
                    index: 'lunarl'
                }, function() {
                    indexEnsured = true;
                    mapping.forEach(function(map) {
                        putMapping(map.map, map.done);
                        mapping = [];
                    })
                });
            } else {
                indexEnsured = true;
                mapping.forEach(function(map) {
                    putMapping(map.map, map.done);
                    mapping = [];
                })
            }
        });
}

function putMapping(map, done) {
    mappingComplete++;
    if (indexEnsured) {
        client.indices.putMapping(map, function(err) {
            mappingComplete--;
            if(done) done(err);
        });
    } else {
        mapping.push({map: map, done: done});
    }
}

exports.putMapping = putMapping;
exports.client = client;
