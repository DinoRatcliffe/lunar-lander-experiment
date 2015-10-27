'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.post('/', controller.create);
router.get('/:id', controller.get);
router.post('/:id', controller.update);

module.exports = router;
