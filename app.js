var express = require('express');
var requestHandlers = require('./requestHandlers');

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(8888);

// Transport

var io = require('socket.io').listen(8889);
io.sockets.on('connection', function (socket) {

  socket.on('game_step', function (data) {
    console.log("Game step: " + data);
  });

});
