function Controller(canvas, goban, size) {
  var self = this;
  this.game = new Game(canvas, goban, size);
  this.graphics = new ViewGraphics(canvas, size, this.game);
  this.goban = goban;
  this.canvas = canvas;

  // Создаем socket.io коннектор, для связи с сервером
  this.socket = io.connect('http://localhost:8889');

  this.socket.on('game_step', function (data) {
    self.game.takePosition(data['positions']);
    self.graphics.redrawStones();
    self.game.swapPlayer();
  });

  this.flash = function(message) {
    $('#flash').text(message);
  }

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
      self.graphics.redrawStones();
      self.game.swapPlayer();
    } else {
      self.flash("Неверный ход!");
    }
  });

}

