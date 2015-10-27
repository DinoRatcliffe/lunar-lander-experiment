'use strict';

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: '192.168.99.100:9200'
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
