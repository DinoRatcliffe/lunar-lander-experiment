'use strict';

var express = require('express');
var elasticsearch = require('./es');
var config = require('./config');

elasticsearch.ensureIndex();

var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

//TODO change to environment variables / abstract through configs 
var listenPort = 8080;
var listenHost = '0.0.0.0';

server.listen(listenPort, listenHost, function() {
    console.log("REST service running on " + listenHost + ":" + listenPort);
});

exports = module.exports = app;
