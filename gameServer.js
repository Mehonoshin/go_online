var Match = require('./match').Match;

function GameServer() {
  this.matches = [];
  this.sessions = [];

  this.addClient = function(newClient) {
    this.sessions.push(newClient);
  }

  this.newMatch = function(initUserId) {
    this.matches.push(new Match(initUserId));
    return this.matches.length - 1;
  }

  this.games = function() {
    return this.matches;
  }
}

exports.GameServer = GameServer;