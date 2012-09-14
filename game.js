$(document).ready(function() {

  function Controller(goban) {
    this.goban = goban;
    this.flash = function(message) {
      $('#flash').text(message);
    }
  }

  function Game(canvas, goban) {
    var self = this;
    this.canvas = canvas;
    this.controller = new Controller(goban);
    this.context = this.canvas[0].getContext('2d');
    this.started = false;
    this.activePlayer = "black";
    this.field = [
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    ];

    this.swapPlayer = function() {
      this.activePlayer = (this.activePlayer == "white") ? "black" : "white"
    }

    this.legalMove = function(position) {
      if (this.field[position[0]][position[1]] != null) {
        return false;
      } else {
        return true;
      }
    }

    this.takePosition = function(positionArray) {
      this.field[positionArray[0]][positionArray[1]] = this.activePlayer;
    }

    // Graphics
    //
    this.coordinatesToPosition = function(arr) {
      // Учитываем краевые позиции, чтобы камень нельзя было поставить дальше поля
      var x = Math.round((arr[0] - 23) / 44);
      if (x > 18) {
        x = 18;
      }
      var y = Math.round((arr[1] - 26) / 44);
      if (y > 18) {
        y = 18;
      }
      return [x, y];
    }

    this.positionToCoordinates = function(arr) {
      return [44 * arr[0] + 23 + arr[0], 44 * arr[1] + 26 + arr[1]];
    }

    this.drawCircle = function(positionArray) {
      var context = this.context;
      context.beginPath();
      var coordArray = this.positionToCoordinates(positionArray);
      context.arc(coordArray[0], coordArray[1], 20, 0, 2 * Math.PI, false);
      context.fillStyle = this.activePlayer;
      context.fill();
      context.closePath();
    }
    // end graphics

    this.canvas.click(function(e) {
      console.log(e);
      var positions = self.coordinatesToPosition([e.offsetX, e.offsetY]);
      if (self.legalMove(positions)) {
        self.takePosition(positions);
        self.drawCircle(positions);
        self.swapPlayer();
        console.log(e);
        console.log(self.field);
      } else {
        self.controller.flash("Неверный ход!");
      }
    });
  };

  var game = new Game($('#canvas'), $('#goban'));

});
