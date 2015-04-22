require('babel/register');

var config = require('../config.json');
var socketServer = require('./server/socket-server.js');

socketServer.start(config.port);
