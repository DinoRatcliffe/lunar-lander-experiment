/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {
    app.use('/user', require('./api/user'));
};
