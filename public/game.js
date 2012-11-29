function Game(canvas, goban, size) {
  var self = this;
  this.canvas = canvas;
  this.goban = goban;
  this.userId = goban.data("userId");
  this.gameId = goban.data("gameId");
  this.started = false;
  this.activePlayer = goban.data('turn');
  this.field = goban.data('field');
  this.size = size;
  this.waitingForOpponentMove = (goban.data('color') != this.activePlayer) ? true : false;
  this.freezeGoban = goban.data('freezeGoban')

  this.swapPlayer = function() {
    this.activePlayer = (this.activePlayer == "white") ? "black" : "white";
    this.waitingForOpponentMove = this.waitingForOpponentMove ? false : true;
  }

  this.legalMove = function(position) {
    console.log(this.field[position[0]][position[1]]);
    console.log("x=" + position[0] + " y=" + position[1]);
    if (this.freezeGoban) { return false; }
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
