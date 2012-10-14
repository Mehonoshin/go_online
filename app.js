// Game bussines logic
var engine = require('./public/goGame');

function BackendGame() {
  this.sessions = [];
  this.addClient = function(newClient) {
    this.sessions.push(newClient);
  }

  this.games = function() {
    return [];
  }
}
BackendGame.prototype = new engine.game();
var gameServer = new BackendGame();

// Web frontend
var express = require('express');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  res.render('index.ejs', {
    activePlayers: gameServer.sessions.length,
    gamesList: gameServer.games
  });
});

app.get('/game', function(req, res) {
  res.render('goban.ejs');
});

app.listen(8888);

// Transport
var io = require('socket.io').listen(8889);
io.sockets.on('connection', function (socket) {

  //console.log("[" + gameServer.tellName() + "]New connection: " + JSON.stringify(socket));
  //gameServer.addClient(socket);
  //console.log("[" + gameServer.tellName() + "]Connections: " + gameServer.sessions);

  socket.on('game_step', function (data) {
    console.log("[" + gameServer.tellName() + "]Game step: " + data);
    //socket.emit('game_step', data);
    //for(session in io.sockets) {
      //session.emit('game_step', data);
    //}
  });

});
