  var gobans = {
    "goban19" : {
      size: 19,
      name: "goban19",
      frameX: 23,
      frameY: 26,
      width: 859,
      height: 861
    },
    "goban13" : {
      size: 13,
      name: "goban13",
      frameX: 23,
      frameY: 26,
      width: 520,
      height: 517
    },
    "goban9" : {
      size: 9,
      name: "goban9",
      frameX: 23,
      frameY: 26,
      width: 353,
      height: 353
    },
    "goban7" : {
      size: 7,
      name: "goban7",
      frameX: 23,
      frameY: 29,
      width: 278,
      height: 273
    }
  };

  function Controller(goban) {
    this.goban = goban;
    this.flash = function(message) {
      $('#flash').text(message);
    }
  }

  function ViewGraphics(canvas, size, game) {
    this.goban = gobans["goban" + size];
    this.context = canvas[0].getContext('2d');
    this.game = game;
    canvas.css('background', 'url(images/goban' + size + '.png)');
    canvas.css('width', this.goban.width);
    canvas.css('height', this.goban.height);

    this.coordinatesToPosition = function(arr) {
      // Учитываем краевые позиции, чтобы камень нельзя было поставить дальше поля
      var x = Math.round((arr[0] - 23) / 44);
      if (x > size - 1) {
        x = size - 1;
      }
      var y = Math.round((arr[1] - 26) / 44);
      if (y > size - 1) {
        y = size - 1;
      }
      return [x, y];
    }

    this.positionToCoordinates = function(arr) {
      // рассчет вида
      // ширина квадрата * смещение + ширина границы + сумма однопиксельных интервалов между квадратами
      return [44 * arr[0] + 23 + arr[0], 44 * arr[1] + 26 + arr[1]];
    }

    this.drawCircle = function(positionArray) {
      var context = this.context;
      context.beginPath();
      var coordArray = this.positionToCoordinates(positionArray);
      context.arc(coordArray[0], coordArray[1], 20, 0, 2 * Math.PI, false);
      context.fillStyle = this.game.activePlayer;
      context.fill();
      context.closePath();
    }
  }

  function Game(canvas, goban, size) {
    var self = this;
    this.canvas = canvas;
    this.controller = new Controller(goban);
    this.graphics = new ViewGraphics(canvas, size, this);
    this.started = false;
    this.activePlayer = "black";
    this.field = [];
    this.size = size;

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
    }

    this.legalMove = function(position) {
      console.log(this.field[position[0]][position[1]]);
      if (this.field[position[0]][position[1]] != undefined) {
        return false;
      } else {
        return true;
      }
    }

    this.takePosition = function(positionArray) {
      this.field[positionArray[0]][positionArray[1]] = this.activePlayer;
    }

    this.canvas.click(function(e) {
      var positions = self.graphics.coordinatesToPosition([e.offsetX, e.offsetY]);
      if (self.legalMove(positions)) {
        self.takePosition(positions);
        self.graphics.drawCircle(positions);
        self.swapPlayer();
      } else {
        self.controller.flash("Неверный ход!");
      }
    });
  };


$(document).ready(function() {
  var game = new Game($('#canvas'), $('#goban'), 19);
});
