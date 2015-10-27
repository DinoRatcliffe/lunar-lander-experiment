'use strict';

var User = require('./user.model');
var _ = require('lodash');

exports.create = function(req, res) {
    User.create(req.body, function(err, user) {
        if (err) { return handleError(res, err); }
        return res.json(201, user);
    });
}

exports.get = function(req, res) {
    User.getById(req.params.id, function(err, response) {
        if (err) { return handleError(res, err); }
        if(!response) { return res.send(404); }
        return res.json(200, response);
    });
};

exports.update = function(req, res) {
    User.update(req.params.id, req.body, function(err, response) {
        if (err) { return handleError(res, err); }
        return res.send(200);
    });
};

function handleError(res, err) {
    if (err.code) {
        return res.send(err.code, err.message);
    } else {
        return res.send(500, err);
    }
}
