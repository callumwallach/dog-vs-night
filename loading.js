class Loading {
  constructor(game) {
    this.game = game;
    this.fontSize = 40;
    this.fontFamily = "Creepster";
  }
  update() {}
  draw(context) {
    context.save();
    context.shadowOffsetX = 4;
    context.shadowOffsetY = 4;
    context.shadowColor = "white";
    context.shadowBlur = 0;
    context.fillStyle = this.game.fontColor;
    context.textAlign = "center";
    context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
    const heading = `Andrew vs Father Time`;
    const message = `A desperate attempt to rewind the clock!`;
    context.fillText(
      heading,
      this.game.width * 0.5,
      this.game.height * 0.5 - 20
    );
    context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
    context.fillText(
      message,
      this.game.width * 0.5,
      this.game.height * 0.5 + 20
    );
    context.restore();
  }
  fadeOut(text) {
    var alpha = 1.0, // full opacity
      interval = setInterval(function () {
        canvas.width = canvas.width; // Clears the canvas
        context.fillStyle = "rgba(255, 0, 0, " + alpha + ")";
        context.font = "italic 20pt Arial";
        context.fillText(text, 50, 50);
        alpha = alpha - 0.05; // decrease opacity (fade out)
        if (alpha < 0) {
          canvas.width = canvas.width;
          clearInterval(interval);
        }
      }, 50);
  }
}

export default Loading;
