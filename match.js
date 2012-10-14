var engine = require('./public/goGame');

function Match(initUserId) {
  this.initUserId = initUserId;

  this.id = function() {
    return this.initUserId;
  }

  this.name = function() {
    return this.initUserId;
  }
}

Match.prototype = new engine.game();

exports.Match = Match;
