'use strict';

var _ = require('lodash'),
    es = require('../../es');

var userCount = 0;

es.putMapping({
    index: 'lunarl',
    type: 'user',
    body: {
        user: {
            properties: {
                difficulty: {type: 'string'},
            }
        }
    }
}, function(err) {
});

function create(body, done) {
    var user = {
        difficulty: userCount++ % 2 === 1 ? 'adjust' : 'traditional',
        visit: {}
    }
    var index = {index: 'lunarl', type: 'user', body: user};
    es.client.index(index, function(err, response) {
        user.id = response._id;
        update(user.id, {id: response._id});
        if (done) return done(err, user);
    });
}

function getById(id, done) {
    var index = {id: id, index: 'lunarl', type: 'user'};
    es.client.get(index, function(err, response) {
        var result;
        if (response.found) {
            response._source.id = response._id;
            result = response._source;
        }
        if (done) done(err, result);
    });
}

function update(id, update_data, done) {
    es.client.update({
        index: 'lunarl',
        type: 'user',
        id: id,
        body: {
            doc: update_data
        }
    }, function (err, response) {
        if (done) {
            return done(err, response._source);
        }
    });
}

exports.update = update;
exports.create = create;
exports.getById = getById;
