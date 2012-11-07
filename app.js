// Game bussines logic
var server = require('./gameServer');
var gameServer = new server.GameServer();

// Web frontend
var express = require('express');

var app = express();
var Cookies = require('cookies');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  var cookies = new Cookies(req, res);
  var player_id = cookies.get('player_id');
  if (player_id == null) {
    player_id = String(Math.round(new Date().getTime() / 1000));
    cookies.set("player_id", player_id);
  }
  res.render('index.ejs', {
    activePlayers: gameServer.sessions.length,
    matchesList: gameServer.matches,
    player_id: player_id
  });
});

app.get('/new_game', function(req, res) {
  var cookies = new Cookies(req, res);
  var userId = cookies.get('player_id'), gobanSize = req.query.size;
  var gameId = gameServer.newMatch(userId, gobanSize);
  res.redirect('/game?userId=' + userId + '&gameId=' + gameId);
});

app.get('/join_game', function(req, res) {
  var cookies = new Cookies(req, res);
  var userId = cookies.get('player_id');
  var gameId = req.query.game_id;
  res.redirect('game?userId=' + userId + '&gameId=' + gameId);
});

app.get('/game', function(req, res) {
  var match = gameServer.getMatch(req.query.gameId);
  if (match.first_player_id == req.query.userId) {
    var color = "white";
  } else {
    var color = "black";
  }
  res.render('goban.ejs', {
    gameId: req.query.gameId,
    gobanSize: match.gobanSize,
    userId: req.query.userId,
    color: color
  });
});

app.listen(8888);

// Transport
var io = require('socket.io').listen(8889);
io.sockets.on('connection', function (socket) {

  socket.on('game_step', function (data) {
    console.log("[]Game step: " + data);
    io.sockets.emit('game_step', {
      turn: data['turn'], 
      positions: data['positions']
    })
    // TODO
    // дергаем у сервера метод гейм-степа
    // берем матч и в нем проверяем валидность хода
  });

});
