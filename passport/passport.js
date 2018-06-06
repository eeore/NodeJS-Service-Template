var LocalStrategy = require('passport-local').Strategy
var models = require('../models');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    //프로그램 작성
    passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        User.findOne({ 'email' : email }, function(err, user) {
            if (err) return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', '이메일이 존재합니다.'));
            } else {
                var newUser = new User();
                newUser.name = req.body.name;
                newUser.email = email;
                newUser.password = newUser.generateHash(password); 
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.use('login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, email, password, done) { 
            console.log(email+', '+password);
            console.log(JSON.stringify(req.body));
            
            models.Admin.findOne({
                where: {
                    email: email
                }
            })
            .then(function (userData) {
                // if (!user.validPassword(password))
                //     return done(null, false, req.flash('loginMessage', '비밀번호가 다릅니다.'));
                if ((userData === null || userData === undefined) === true) {
                    return done(null, false, req.flash('loginMessage', '사용자를 찾을 수 없습니다.'));
                } else {
                    //정상 처리
                    return done(null, userData);
                }
            });
        }));
};