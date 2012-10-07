// Web frontend
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.render('index.html');
});
app.listen(8888);


// Game bussines logic
var engine = require('./goGame');
function BackendGame() {
  this.sessions = [];
}
BackendGame.prototype = new engine.game();
var gameServer = new BackendGame();


// Transport
var io = require('socket.io').listen(8889);
io.sockets.on('connection', function (socket) {

  socket.on('game_step', function (data) {
    console.log("[" + gameServer.tellName() + "]Game step: " + data);
  });

});
