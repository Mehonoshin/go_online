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

  this.setDbField = function(name, value) {
    client.set("go_online:matches:" + this.matchId + ":" + name, value);
  }

  this.getDbField = function(name, callback) {
    var value = null;
    client.get("go_online:matches:" + this.matchId + ":" + name, function(error, result) {
      callback(name, result);
    });
    return value;
  }

  this.save = function() {
    for (attr in this) {
      if (typeof this[attr] != "function") {
        this.setDbField(attr, this[attr]);
      }
    }
  }

  this.restore = function(restoreId) {
    this.matchId = restoreId;
    var that = this;
    for (attr in this) {
      if (typeof this[attr] != 'function') {
        this.getDbField(attr, function(attr_name, result) { that[attr_name] = result; });
      }
    }
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

  // Constructor
  if (restoreId == null) {
    this.save();
  } else {
    this.restore(restoreId);
  }
}

Match.prototype = new engine.game();

exports.Match = Match;
