// server.js

const conf = require('./conf');

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var gson = require('express-gson');
var fetcher = require('express-param');
var expressJwt = require('express-jwt');

//API
var API = {
    user: require('./api/users')
};

//File service
app.use('/files', express.static(path.join(__dirname, 'files')));

app.use('/api', expressJwt({secret: conf.secret}));

app.use(gson());
app.use(fetcher());

app.use('/api/users', API.user);



app.use(function (req, res, next) {
    if (req.session.jwt) {
        res.locals.jwt = req.session.jwt;
    } else {
        res.locals.jwt = undefined;
    }
    if (req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = undefined;
    }


    next();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    
});

module.exports = app;



// // Database
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO_DB_LOGIN_API, {useMongoClient: true});
// var db = mongoose.connection;
// db.once('open', function () {
//    console.log('DB connected!');
// });
// db.on('error', function (err) {
//   console.log('DB ERROR:', err);
// });

// // Middlewares
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
//   next();
// });

// // API
// app.use('/api/users', require('./api/users')); //2
// app.use('/api/auth', require('./api/auth'));   //2

// // Server
// var port = 3000;
// app.listen(port, function(){
//   console.log('listening on port:' + port);
// });