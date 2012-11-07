function Game(canvas, goban, size) {
  var self = this;
  this.canvas = canvas;
  this.goban = goban;
  this.started = false;
  this.activePlayer = "white";
  this.field = [];
  this.size = size;
  this.waitingForOpponentMove = (goban.data('color') == "black") ? true : false;

  for(var j = 0; j < size; j++) {
    this.field[j] = [];
  }
  for(var i = 0; i < size; i++) {
    for(var j = 0; j < size; j++) {
      this.field[i][j] = undefined;
    }
  }

  this.swapPlayer = function() {
    this.activePlayer = (this.activePlayer == "white") ? "black" : "white";
    this.waitingForOpponentMove = this.waitingForOpponentMove ? false : true;
  }

  this.legalMove = function(position) {
    console.log(this.field[position[0]][position[1]]);
    console.log("x=" + position[0] + " y=" + position[1]);
    if (this.waitingForOpponentMove || (this.field[position[0]][position[1]] != undefined)) {
      return false;
    } else {
      return true;
    }
  }

  this.takePosition = function(positionArray) {
    this.field[positionArray[0]][positionArray[1]] = this.activePlayer;
  }
};
Game.prototype = new GoGame.game();
