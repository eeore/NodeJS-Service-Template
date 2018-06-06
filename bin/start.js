#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../server');
var debug = require('debug')('node:server');
var http = require('http');
var models = require("../models"); //추가한 부분.
// var Moment = require('moment-timezone');

//http://momentjs.com/timezone/
// Moment().tz('Asia/Seoul').format();
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');

console.log('port: ' + port);

app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
console.log('http.createServer');
/**
 * Listen on provided port, on all network interfaces.
 */

const isSync = false;

if (isSync == true) {

  models.sequelize.sync({
    force: true
  })
    .then(function () {
      console.log('sync...');
      //insert seed data
      // return require('../seeddata').insert();

      // models.Admin.findOne({
      //     where: {
      //       email: 'developer@nespoon.com'
      //     }
      //   })
      //   .then((admin) => {
      //     if (admin) {

      //     } else {
      //       models.Admin.create({
      //           email: 'developer@nespoon.com',
      //           password: 'ne1coffee',
      //           name: 'NESPOON'
      //         })
      //         .then(function (createdUserCore) {

      //         });
      //     }
      //   });

      // models.Parent.findOne({
      //     where: {
      //       email: 'choi@nespoon.com'
      //     }
      //   })
      //   .then((parent) => {
      //     if (parent) {

      //     } else {
      //       models.Parent.create({
      //           email: 'choi@nespoon.com',
      //           password: 'ne1coffee',
      //           name: 'CJY',
      //           call_name: 'Father',
      //           birthdate: '1981-04-08'
      //         })
      //         .then(function (createdUserCore) {

      //         });
      //     }
      //   });


    })
    .then(function () {
      server.listen(port);
      server.on('error', onError);
      server.on('listening', onListening);
      console.log('ready');
    });
} else {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log('ready');
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}