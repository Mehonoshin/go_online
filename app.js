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
  var userId = 123, gobanSize = req.query.size;
  var gameId = gameServer.newMatch(userId, gobanSize);
  res.redirect('/game?userId=' + userId + '&gameId=' + gameId);
});

app.get('/join_game', function(req, res) {
  res.redirect('game?id=');
});

app.get('/game', function(req, res) {
  var match = gameServer.getMatch(req.query.gameId);
  res.render('goban.ejs', {
    gameId: req.query.gameId,
    gobanSize: match.gobanSize,
    userId: req.query.userId
  });
});

app.listen(8888);

// Transport
var io = require('socket.io').listen(8889);
io.sockets.on('connection', function (socket) {

  socket.on('game_step', function (data) {
    console.log("[]Game step: " + data);
    io.sockets.emit('game_step', {turn: data['turn'], positions: data['positions']})
  });

});
