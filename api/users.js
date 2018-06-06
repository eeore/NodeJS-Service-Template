var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt-nodejs");

router.route('')
    .get(function (req, res, next) {
        res.json('hello');
    });


function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = router;