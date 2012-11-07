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
