/**
 * Express Configuration
 */

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, X-Requested-With, Accept');

    next();
}

module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(allowCrossDomain);

    //limit put and post to content type json
    var RE_CONTYPE = /^application\/(?:x-www-form-urlencoded|json)(?:[\s;]|$)/i;
}
