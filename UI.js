import settings from "./settings.js";

class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    this.livesImage = document.getElementById("lives");
    this.text = settings[this.game.recipient].end;
  }
  update() {}
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    //score
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillText(`Score: ${this.game.score}`, 20, 50);
    // timer
    context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
    context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80);
    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
    }
    // empowered
    if (this.game.player.isEmpowered() && this.game.powerBar) {
      // context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
      // context.fillText(
      //   `Power: ${(this.game.player.empoweredTimer * 0.001).toFixed(1)}`,
      //   20,
      //   140
      // );
      //context.drawImage(this.fireImage, 10, 115, 45, 45);
      context.save();
      const barWidth = 100;
      const barHeight = 13;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowColor = "white";
      context.shadowBlur = 0;
      context.lineWidth = 2;
      context.strokeRect(20, 135, barWidth, barHeight);
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.fillRect(20, 135, barWidth - 2, barHeight - 2);
      //const pattern = context.createPattern(this.fireImage, "repeat");
      //context.drawImage(this.fireImage, 20, 140, 200, 45);
      //context.fillStyle = "#FA824E"; //pattern;
      //context.fillStyle = "rgba(218, 165, 32, 0.8)";
      //context.fillStyle = "rgba(227, 119, 77, 0.83)";
      context.fillStyle = "#F9EC31";
      //context.fillStyle = "#F8CC2A";
      context.fillRect(
        20,
        135,
        this.game.player.empoweredTimer / 100,
        barHeight
      );
      context.restore();
    }
    // boss
    if (this.game.bossStage && this.game.boss.getHealth() > 0) {
      const gw = this.game.width;
      const gh = this.game.height;
      context.save();
      const barWidth = 250;
      const barHeight = 13;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowColor = "white";
      context.shadowBlur = 0;
      context.lineWidth = 2;
      context.strokeRect(
        gw * 0.5 - barWidth * 0.5,
        gh * 0.15,
        barWidth,
        barHeight
      );
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.fillRect(
        gw * 0.5 - barWidth * 0.5 + 1,
        gh * 0.15 + 1,
        barWidth - 2,
        barHeight - 2
      );
      context.fillStyle = "white";
      context.fillRect(
        gw * 0.5 - barWidth * 0.5 + 1,
        gh * 0.15 + 1,
        (this.game.boss.getHealth() / this.game.boss.maxHealth) * barWidth - 2,
        barHeight - 2
      );
      context.restore();
    }
    // game over
    if (this.game.gameOver) {
      const gw = this.game.width;
      const gh = this.game.height;
      context.textAlign = "center";
      context.fillStyle = "rgba(255,255,255,.1)";
      context.fillRect(0, 0, gw, gh);
      context.fillStyle = this.game.fontColor;
      if (this.game.success) {
        this.text.success.forEach((line) => {
          context.font = `${this.fontSize * line.fontSize}px ${
            this.fontFamily
          }`;
          context.fillText(line.message, gw * 0.5, gh * 0.5 + line.position);
        });
      } else {
        this.text.failure.forEach((line) => {
          context.font = `${this.fontSize * line.fontSize}px ${
            this.fontFamily
          }`;
          context.fillText(line.message, gw * 0.5, gh * 0.5 + line.position);
        });
      }
    }
    context.restore();
  }
}

export default UI;
