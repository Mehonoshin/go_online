  var gobans = {
    "goban19" : {
      size: 19,
      name: "goban19",
      frameX: 23,
      frameY: 26,
      width: 859,
      height: 861,
      cellsize: 44
    },
    "goban13" : {
      size: 13,
      name: "goban13",
      frameX: 12,
      frameY: 12,
      width: 520,
      height: 517,
      cellsize: 40
    },
    "goban9" : {
      size: 9,
      name: "goban9",
      frameX: 12,
      frameY: 12,
      width: 353,
      height: 353,
      cellsize: 40
    },
    "goban7" : {
      size: 7,
      name: "goban7",
      frameX: 14,
      frameY: 13,
      width: 278,
      height: 273,
      cellsize: 40
    }
  };

  function Controller(canvas, goban, size) {
    var self = this;
    this.game = new Game(canvas, goban, size);
    this.graphics = new ViewGraphics(canvas, size, this.game);
    this.sizeSwitcher = $(goban).find("#size-switcher");
    this.goban = goban;
    this.canvas = canvas;
    // Создаем socket.io коннектор, для связи с сервером
    this.socket = io.connect('http://localhost:8889');

    this.socket.on('game_step', function (data) {
      //if (self.game.legalMove(data['positions'])) {
        self.game.takePosition(data['positions']);
        self.graphics.drawCircle(data['positions']);
        self.game.swapPlayer();
      //}
    });

    this.flash = function(message) {
      $('#flash').text(message);
    }

    this.sizeSwitcher.change(function(e) {
      var size = $(this).val();
      self.game = new Game(self.canvas, self.goban, size);
      self.graphics = new ViewGraphics(self.canvas, size, self.game);
    });

    this.canvas.click(function(e) {
      var positions = self.graphics.coordinatesToPosition([e.offsetX, e.offsetY]);
      if (self.game.legalMove(positions)) {
        self.game.takePosition(positions);
        // TODO
        // отправляем gameId и подпись игрока
        self.socket.emit('game_step', {
          turn: self.game.activePlayer, 
          positions: positions
        });
        self.graphics.drawCircle(positions);
        self.game.swapPlayer();
      } else {
        self.flash("Неверный ход!");
      }
    });

  }

  function ViewGraphics(canvas, size, game) {
    this.goban = gobans["goban" + size];
    this.game = game;
    canvas.css('background', 'url(images/goban' + size + '.png)');
    canvas.css('width', this.goban.width);
    canvas.css('height', this.goban.height);
    canvas[0].width = this.goban.width;
    canvas[0].height = this.goban.height;
    this.context = canvas[0].getContext('2d');

    this.coordinatesToPosition = function(arr) {
      // Учитываем краевые позиции, чтобы камень нельзя было поставить дальше поля
      var x = Math.round((arr[0] - this.goban.frameX) / this.goban.cellsize);
      if (x > size - 1) {
        x = size - 1;
      }
      var y = Math.round((arr[1] - this.goban.frameY) / this.goban.cellsize);
      if (y > size - 1) {
        y = size - 1;
      }
      return [x, y];
    }

    this.positionToCoordinates = function(arr) {
      // рассчет вида
      // ширина квадрата * смещение + ширина границы + сумма однопиксельных интервалов между квадратами
      return [this.goban.cellsize * arr[0] + this.goban.frameX + arr[0], this.goban.cellsize * arr[1] + this.goban.frameY + arr[1]];
    }

    this.drawCircle = function(positionArray) {
      var context = this.context;
      console.log(context);
      context.beginPath();
      var coordArray = this.positionToCoordinates(positionArray);
      console.log(coordArray);
      context.arc(coordArray[0], coordArray[1], 20, 0, 2 * Math.PI, false);
      context.fillStyle = this.game.activePlayer;
      context.fill();
      context.closePath();
    }
  }

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

$(document).ready(function() {
  gameController = new Controller($('#canvas'), $('#goban'), $('#goban').data('gobanSize'));
});
