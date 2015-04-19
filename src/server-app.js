require('babel/register');

var socketServer = require('./server/socket-server.js');

socketServer.start();
