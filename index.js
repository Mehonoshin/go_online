var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle['/'] = requestHandlers.index;
handle['/index'] = requestHandlers.index;
handle['/about'] = requestHandlers.about;
handle['/auth'] = requestHandlers.auth;
handle['/game'] = requestHandlers.game;

server.start(router.route, handle);
