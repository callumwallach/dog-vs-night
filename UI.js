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
    // game over
    if (this.game.gameOver) {
      const playerWon = this.game.score >= this.game.winningScore;
      context.textAlign = "center";
      context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
      //const heading = playerWon ? `Well done!` : `Love at first bite?`;
      const heading = `Game Over!`;
      const message = playerWon ? `What are the creatures of the night afraid of? YOU!!!` : `Better luck next time!`;
      context.fillText(heading, this.game.width * 0.5, this.game.height * 0.5 - 20);
      context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
      context.fillText(message, this.game.width * 0.5, this.game.height * 0.5 + 20);
    }
    // debug
    // context.fillText(`Speed: ${this.game.speed}`, 20, 100);
    // context.fillText(`State: ${this.game.player.currentState.state}`, 20, 120);
  }
}

export default UI;
