// Game bussines logic
var server = require('./gameServer');
var gameServer = new server.GameServer();

// Web frontend
var express = require('express');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  res.render('index.ejs', {
    activePlayers: gameServer.sessions.length,
    matchesList: gameServer.matches
  });
});

app.get('/new_game', function(req, res) {
  var gameId = gameServer.newMatch(123);
  res.redirect('/game?id=' + gameId);
});

app.get('/join_game', function(req, res) {
  res.redirect('game?id=');
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
