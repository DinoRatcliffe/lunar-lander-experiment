'use strict'
var config = {};


//elasticsearch
config.elasticsearch = {};
config.elasticsearch.host = 
    process.env.ELASTICSEARCH_PORT_9200_TCP_ADDR || 
    process.env.ELASTICSEARCH_HOST || 
    '192.168.99.100';
config.elasticsearch.port = 
    process.env.ELASTICSEARCH_PORT_9200_TCP_PORT ||
    process.env.ELASTICSEARCH_PORT || 
    9200;

module.exports = config;
