var engine = require('./public/goGame');

function Match(id, initUserId, gobanSize) {
  this.matchId = id;
  this.initUserId = initUserId;
  this.secondUserId = "";
  this.gobanSize = gobanSize;

  this.id = function() {
    return this.matchId;
  }

  this.first_player_id = function() {
    return this.initUserId;
  }

  this.second_player_id = function() {
    return this.secondUserId;
  }

  this.name = function() {
    return this.initUserId;
  }
}

Match.prototype = new engine.game();

exports.Match = Match;
