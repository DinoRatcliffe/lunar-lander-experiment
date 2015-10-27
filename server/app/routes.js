/**
 * Main application routes
 */

'use strict';
var auth = require('authorized');

module.exports = function(app) {
    app.use('/user', require('./api/user'));
};
