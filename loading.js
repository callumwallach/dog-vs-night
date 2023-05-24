import settings from "./settings.js";

class Loading {
  constructor(game) {
    this.game = game;
    this.fontSize = 40;
    this.fontFamily = "Creepster";
    this.text = settings[this.game.recipient].loading;
  }
  update() {}
  draw(context) {
    const gw = this.game.width;
    const gh = this.game.height;
    context.save();
    context.fillStyle = "rgba(255,255,255,.15)";
    context.fillRect(0, 0, gw, gh);
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;
    context.fillStyle = this.game.fontColor;
    context.textAlign = "center";
    this.text.forEach((line) => {
      context.font = `${this.fontSize * line.fontSize}px ${this.fontFamily}`;
      context.fillText(line.message, gw * 0.5, gh * 0.5 + line.position);
    });
    context.restore();
  }
}

export default Loading;
