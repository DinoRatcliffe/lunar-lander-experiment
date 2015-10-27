'use strict';

angular.module('abyork')
.factory('User', function ($resource, APIURL) {
    return $resource(APIURL + '/user', {
    }, {
        init: {
            method: 'POST',
            url: APIURL + '/user'
        },
        update: {
            method: 'POST',
            url: APIURL + '/user/:id',
            params: {
                id: "@id"
            }
        },
        get: {
            method: 'GET',
            url: APIURL + '/user/:id',
            params: {
                id: "@id"
            }
        }
    });
});
