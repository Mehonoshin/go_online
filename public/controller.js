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

