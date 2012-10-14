var engine = require('./public/goGame');

function BackendGame() {
  this.matches = [];
  this.sessions = [];

  this.addClient = function(newClient) {
    this.sessions.push(newClient);
  }

  this.newMatch = function(initUserId) {
    this.matches.push({initUserId: initUserId, opponentId: null});
    return this.matches.length - 1;
  }

  this.games = function() {
    return this.matches;
  }
}
BackendGame.prototype = new engine.game();

exports.BackendGame = BackendGame;
