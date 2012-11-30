var engine = require('../public/shared/goGame');
var MatchData = require('./matchData').MatchData;

function Match(id, initUserId, gobanSize, restoreId) {
  this.data = new MatchData(id, initUserId, gobanSize, restoreId);

  this.id = function() {
    return this.data.matchId;
  }

  this.firstPlayerId = function() {
    return this.data.initUserId;
  }

  this.secondPlayerId = function() {
    return this.data.secondUserId;
  }

  this.name = function() {
    return "[x" + this.data.gobanSize + "] " + this.firstPlayerId() + " VS " + this.secondPlayerName();
  }

  this.secondPlayerName = function() {
    return (this.secondPlayerId() != null) ? this.secondPlayerId() : "[pending]";
  }

  this.joinMatch = function(playerId) {
    if (this.firstPlayerId() == playerId) {  }
    if ((this.firstPlayerId() != playerId) && (this.secondPlayerId() == null)) {
      this.data.secondUserId = playerId;
    }
    if ((this.firstPlayerId() != playerId) && (this.secondPlayerId() != playerId) && (this.firstPlayerId() != null) && (this.secondPlayerId() != null)) {
      this.data.viewers.push(playerId);
    }
  }

  this.gameStep = function(data) {
    if (this.legalMove(data)) {
      this.takePosition(data);
      this.swapPlayers();
      this.data.save();
      return true;
    } else {
      return false;
    }
  }

  this.takePosition = function(data) {
    this.data.field[data['positions'][0]][data['positions'][1]] = data['turn'];
  }

  this.legalMove = function(data) {
    if ((data['userId'] != this.firstPlayerId()) && (data['userId'] != this.secondPlayerId())) {
      return false;
    }
    return true;
  }

  this.swapPlayers = function(data) {
    this.data.turn = (this.data.turn == "white") ? "black" : "white";
  }

  this.playerId = function(color) {
    if (color == "white") {
      return this.firstPlayerId();
    } else {
      return this.secondPlayerId();
    }
  }

  // Constructor
  if (restoreId == null) {
    this.data.save();
  } else {
    this.data.restore(restoreId);
  }
}

Match.prototype = new engine.game();

exports.Match = Match;
