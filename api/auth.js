var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
var dateHelpoer = require('../util/date-helper');
var Sequelize = require('sequelize');
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool')
var bcrypt = require("bcrypt-nodejs");

var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'email_here',
        pass: 'password_here'
    }
});

//비밀번호 유효성 검사
router.route('/check-valid-password')
    .post(function (req, res, next) {
        // var id = req.params.id;
        // var options = req.fetchParameter(['email']);

        var newData = req.body;
        const reqUserId = req.params.userId;
        const reqPassword = req.body.password;
        var passwordHash = generateHash(reqPassword);
        //내 자신인지 검사하고 수정. admin일 경우 검사할 필요 없음

        models.User.findOne({
            where: {
                id: reqUserId
            }
        }).then(function (findedUser) {
            console.log(JSON.stringify(findedUser));
            if ((findedUser === null || findedUser === undefined) === true) {
                //err:아이디가 중복되는 경우.
                var r = {
                    result: 'notfound'
                };
                res.status(404).json(r);
            } else {

                if (bcrypt.compareSync(reqPassword, findedUser.password) == true) {
                    var r = {
                        result: 'found'
                    };
                    res.json(200, r);
                } else {
                    var r = {
                        result: 'wrong'
                    };
                    res.json(401, r);
                }
            }

        });
    });

//비밀번호 찾기
router.post('/users/find-password', function (req, res, next) {
    const email = req.body.email;

    const tempPassword = generatePassword();
    models.User.update({
        password: tempPassword
    }, {
        where: {
            email: email
            // user_id: 
        }
    }).then(function (updatedUser) {
        console.log(updatedUser);


        //임시 비밀번호 생성 후 메일로 발송한다.
        smtpTransport.sendMail(getFindPasswordMailOption(email, tempPassword), function (error, response) {

            if (error) {
                console.log('error: ' + email + ' / ' + error);
                res.status(200).json(error);
            } else {
                console.log("Message sent : " + JSON.stringify(response));
                res.status(200).json(response.message);
            }
            smtpTransport.close();
        });



    }).catch(function (err) {
        console.log(err);
        res.status(204).json({
            res: "not exist"
        });
        next(1008);
    });

    //가입처리, 혹은 비밀번호 일치 검사 후 토큰 재발행
    router.post('/users', function (req, res, next) {
        const reqEmail = req.body.email;
        const reqPassword = req.body.password;
        const reqName = req.body.name;

        var passwordHash = generateHash(reqPassword);

        models.User.findOne({
                where: {
                    email: reqEmail
                }
            })
            .then(function (findedUser) {
                if ((findedUser === null || findedUser === undefined) === false) {
                    //err:아이디가 중복되는 경우.
                    var r = {
                        result: 'duplicated'
                    };
                    res.json(409, r);
                } else {
                    var r = {
                        result: 'nothing'
                    };

                    models.User.create({
                        email: reqEmail,
                        password: passwordHash,
                        name: reqName
                    }).then(function (user) {
                        user.password = null;
                        user.role = user.role;
                        var tokenSrc = {
                            id: user.id,
                            role: user.role,
                            name: user.name,
                            email: user.email
                        };
                        var token = jwt.sign(tokenSrc, env.secret, {
                            expiresIn: env.tokenExpiredIn
                        });

                        user.dataValues.token = token
                        // console.log(user);
                        // res.json(user);
                        r.user = user;
                        res.json(200, r);
                    }).catch(function (err) {
                        console.log(err);
                        next(1006);
                    });



                }

            });
    });

    //Get Token for user
    router.post('/users/token', function (req, res) {
        console.log('body: ' + JSON.stringify(req.body));

        //if is invalid, return 401
        var password = String(req.body.password);
        var passwordHash = generateHash(password);

        console.log('hash: ' + passwordHash);

        models.User.findOne({
            where: {
                email: req.body.email
            }
        }).then((user) => {
            if (user) {
                console.log('User: ', user.dataValues + ', ' + password);
                // We are sending the profile inside the token
                if (user.password.length > 30) {
                    if (bcrypt.compareSync(password, user.password) == true) {
                        user.dataValues.password = null;
                        user.dataValues.role = user.role;
                        var tokenSrc = {
                            id: user.id,
                            role: user.role,
                            name: user.name,
                            email: user.email
                        };

                        var token = jwt.sign(tokenSrc, env.secret, {
                            expiresIn: env.tokenExpiredIn
                        });
                        res.json(200, {
                            token: token,
                            user_id: user.id
                        });
                    } else {
                        console.log('User: is nothing');
                        res.json(401, {
                            res: 'Wrong user or password'
                        });
                    }
                } else {
                    if (user.password == password) {
                        user.dataValues.password = null;
                        user.dataValues.role = user.role;
                        var tokenSrc = {
                            id: user.id,
                            role: user.role,
                            name: user.name,
                            email: user.email
                        };
                        var token = jwt.sign(tokenSrc, env.secret, {
                            expiresIn: env.tokenExpiredIn
                        });
                        res.status(200).json({
                            token: token,
                            user_id: user.id
                        });
                    } else {
                        console.log('User: is nothing');
                        res.json(401, {
                            res: 'Wrong user or password'
                        });
                    }
                }
            } else {
                console.log('User: is nothing');
                res.status(401).json({
                    res: 'Wrong user or password'
                });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(204).json({
                res: "not exist"
            });
            // next(1008);
        });;
    });
});