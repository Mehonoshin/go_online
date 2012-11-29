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
  var color = (match.firstPlayerId() == req.query.userId) ? "white" : "black";
  match.joinMatch(req.query.userId);

  res.render('goban.ejs', {
    match: match,
    gameId: req.query.gameId,
    gobanSize: match.data.gobanSize,
    userId: req.query.userId,
    color: color
  });
  console.log("gobanSize=" + match.data.gobanSize);
});

app.listen(8888);

var	redis = require('redis'),	
    client = redis.createClient();

client.on("error", function (err) {
   console.log("Error: " + err);
});

// Transport
var io = require('socket.io').listen(8889);
io.sockets.on('connection', function (socket) {

  socket.on('game_step', function (data) {
    console.log("[debug] Game step: " + data);
    var match = gameServer.getMatch(data['gameId']);
    if (match.gameStep(data)) {
      socket.broadcast.emit('game_step', {
        turn: data['turn'],
        positions: data['positions'],
        userId: data['userId'],
        gameId: data['gameId']
      });
    }
  });
});


