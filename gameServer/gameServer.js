var Match = require('./match').Match;
var	redis = require('redis'),	
    client = redis.createClient();

function GameServer() {
  var self = this;
  this.matches = [];
  this.sessions = [];

  this.addClient = function(newClient) {
    this.sessions.push(newClient);
  }

  this.getMatch = function(id) {
    return this.matches[id];
  }

  this.newMatch = function(initUserId, gobanSize) {
    var match_id = (this.matches.length == 0) ? 0 : this.matches[this.matches.length - 1].matchId + 1;
    this.matches.push(new Match(match_id, initUserId, gobanSize, null));
    client.sadd("go_online:matches_ids", match_id);
    return match_id;
  }

  this.loadMatches = function() {
    client.smembers("go_online:matches_ids", function(error, matches_ids) {
      console.log("ids: " + matches_ids);
      for (id in matches_ids) {
        console.log("id: " + id);
        self.matches.push(new Match(null, null, null, id));
      }
    });
  }

  // TODO
  // Тупое название. Переименовать
  this.games = function() {
    return this.matches;
  }

  // Прелоадим матчи при запуске сервера
  this.loadMatches();

}
exports.GameServer = GameServer;
