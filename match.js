var engine = require('./public/goGame');

function Match(initUserId, gobanSize) {
  this.initUserId = initUserId;
  this.gobanSize = gobanSize;

  this.id = function() {
    return this.initUserId;
  }

  this.name = function() {
    return this.initUserId;
  }
}

Match.prototype = new engine.game();

exports.Match = Match;
