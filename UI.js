class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    this.livesImage = document.getElementById("lives");
    this.fireImage = document.getElementById("fire");
  }
  update() {}
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    //score
    context.fillText(`Score: ${this.game.score}`, 20, 50);
    // timer
    context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
    context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80);
    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
    }
    // empowered
    if (this.game.player.isEmpowered()) {
      context.drawImage(this.fireImage, 10, 115, 45, 45);
    }
    // boss
    if (this.game.bossStage && this.game.boss.getHealth() > 0) {
      context.save();
      const barWidth = 250;
      const barHeight = 13;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowColor = "white";
      context.shadowBlur = 0;
      context.lineWidth = 2;
      context.strokeRect(
        this.game.width * 0.5 - barWidth * 0.5,
        this.game.height * 0.15,
        barWidth,
        barHeight
      );
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.fillRect(
        this.game.width * 0.5 - barWidth * 0.5 + 1,
        this.game.height * 0.15 + 1,
        barWidth - 2,
        barHeight - 2
      );
      context.fillStyle = "white";
      context.fillRect(
        this.game.width * 0.5 - barWidth * 0.5 + 1,
        this.game.height * 0.15 + 1,
        (this.game.boss.getHealth() / this.game.boss.maxHealth) * barWidth - 2,
        barHeight - 2
      );
      context.restore();
    }
    // game over
    if (this.game.gameOver) {
      const playerWon =
        this.game.success || this.game.score >= this.game.winningScore;
      context.textAlign = "center";
      context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
      //const heading = playerWon ? `Well done!` : `Love at first bite?`;
      const heading = this.game.success
        ? `Mid Life Crisis averted!`
        : `Game Over!`;
      context.fillText(
        heading,
        this.game.width * 0.5,
        this.game.height * 0.5 - 20
      );

      if (this.game.success) {
        context.font = `${this.fontSize * 1}px ${this.fontFamily}`;
        context.fillText(
          `Happy Birthday!!`,
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
        context.fillText(
          `Your new age is ${Math.max(
            21,
            50 - Math.floor(this.game.score / 100)
          )}!!`,
          this.game.width * 0.5,
          this.game.height * 0.5 + 60
        );
      } else {
        const message = playerWon
          ? `What are the creatures of the night afraid of? YOU!!!`
          : `Better luck next time!`;
        context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
        context.fillText(
          message,
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    //context.restore();
    // debug
    // context.fillText(`Speed: ${this.game.speed}`, 20, 100);
    // context.fillText(`State: ${this.game.player.currentState.state}`, 20, 120);
  }
}

export default UI;
