var	redis = require('redis'),	
    client = redis.createClient();

client.on("error", function (err) {
   console.log("Error: " + err);
});

function MatchData(id, initUserId, gobanSize, restoreId) {
  this.serializableFields = ["matchId", ];
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

  this.formatFields = function(attr, value) {
    if (attr == "gobanSize") {
      return parseInt(value);
    }
    if (attr == "viewers" && value == "") {
      return [];
    }
    if (attr == "field") {
      var array = value.split(",");
      var restoredField = [];
      var from = 0;
      var to = 20;
      for (var i = 0; i < this.gobanSize; i++) {
        var gobanLine = array.slice(from, to);
        for(var j = 0; j < gobanLine.length; j++) {
          if (gobanLine[j] == "") {
            gobanLine[j] = undefined;
          }
        }
        restoredField[i] = gobanLine;
        from = to;
        to = to + this.gobanSize;
      }
      return restoredField;
    }
    return value;
  }

  this.restore = function(restoreId) {
    this.matchId = restoreId;
    var that = this;
    for (attr in this) {
      if (typeof this[attr] != 'function') {
        this.getDbField(attr, function(attr_name, result) {
          that[attr_name] = that.formatFields(attr_name, result);
          console.log("attr=" + attr_name + " value=" + that[attr_name]);
        });
      }
    }
  }

}

exports.MatchData = MatchData;
