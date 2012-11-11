var engine = require('./public/goGame');
var	redis = require('redis'),	
    client = redis.createClient();

client.on("error", function (err) {
   console.log("Error: " + err);
});

function Match(id, initUserId, gobanSize, restoreId) {
  this.matchId = id;
  this.initUserId = initUserId;
  this.secondUserId = null;
  this.gobanSize = gobanSize;
  this.viewers = [];
  this.turn = "white";
  this.field = [];

  for(var j = 0; j < gobanSize; j++) {
    this.field[j] = [];
  }
  for(var i = 0; i < gobanSize; i++) {
    for(var j = 0; j < gobanSize; j++) {
      this.field[i][j] = undefined;
    }
  }

  this.save = function() {
    client.set("go_online:matches:" + this.matchId + ":matchId", this.matchId);
    client.set("go_online:matches:" + this.matchId + ":initUserId", this.initUserId);
    client.set("go_online:matches:" + this.matchId + ":secondUserId", this.secondUserId);
    client.set("go_online:matches:" + this.matchId + ":turn", this.turn);
    client.set("go_online:matches:" + this.matchId + ":gobanSize", this.gobanSize);
    //client.mset("go_online:matches:" + this.matchId + ":field", this.field);
    //client.set("go_online:matches:" + this.matchId + ":viewers", this.viewers);
  }

  this.restore = function(restoreId) {
    console.log("Restoring " + restoreId);
  }

  if (restoreId == null) {
    this.save();
  } else {
    this.restore(restoreId);
  }

  // Методы экземпляра

  this.id = function() {
    return this.matchId;
  }

  this.name = function() {
    return "[x" + this.gobanSize + "] " + this.initUserId + " VS " + this.secondPlayerName();
  }

  this.firstPlayerId = function() {
    return this.initUserId;
  }

  this.secondPlayerId = function() {
    return this.secondUserId;
  }

  this.secondPlayerName = function() {
    return (this.secondUserId != null) ? this.secondUserId : "[pending]";
  }

  this.joinMatch = function(playerId) {
    console.log("init=" + this.initUserId + " second=" + this.secondUserId);
    if (this.initUserId == playerId) {  }
    if ((this.initUserId != playerId) && (this.secondUserId == null)) {
      this.secondUserId = playerId;
    }
    if ((this.initUserId != playerId) && (this.secondUserId != playerId) && (this.initUserId != null) && (this.secondUserId != null)) {
      this.viewers.push(playerId);
    }
  }

  this.gameStep = function(data) {
    console.log(this.field);
    if (this.legalMove(data)) {
      this.takePosition(data);
      this.swapPlayers();
      this.save();
      return true;
    } else {
      return false;
    }
  }

  this.takePosition = function(data) {
    this.field[data['positions'][0]][data['positions'][1]] = data['turn'];
  }

  this.legalMove = function(data) {
    console.log("userId=" + data['userId'] + " initUserId=" + this.initUserId + " secondUserId=" + this.secondUserId);
    if ((data['userId'] != this.initUserId) && (data['userId'] != this.secondUserId)) {
      return false;
    }
    return true;
  }

  this.swapPlayers = function(data) {
    this.turn = (this.turn == "white") ? "black" : "white";
  }

  this.playerId = function(color) {
    if (color == "white") {
      return this.initUserId;
    } else {
      this.secondUserId;
    }
  }

}

Match.prototype = new engine.game();

exports.Match = Match;
