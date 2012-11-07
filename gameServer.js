var Match = require('./match').Match;
var GoGame = require('./public/goGame');

function GameServer() {
  this.matches = [];
  this.sessions = [];

  this.addClient = function(newClient) {
    this.sessions.push(newClient);
  }

  this.getMatch = function(id) {
    return this.matches[id];
  }

  this.newMatch = function(initUserId, gobanSize) {
    this.matches.push(new Match(this.matches.length, initUserId, gobanSize));
    return this.matches.length - 1;
  }

  this.games = function() {
    return this.matches;
  }
}
exports.GameServer = GameServer;
