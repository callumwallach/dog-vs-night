class PowerUp {
  constructor(game, x, y) {
    this.game = game;
    this.image = document.getElementById("gem");
    this.width = 49;
    this.height = 50;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.frameX = 0;
    this.maxFrame = 50;
    this.markedForDeletion = false;
    this.fps = Math.random() * 10 + 5;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }
  update(deltaTime) {
    this.x -= this.game.speed;
    // garbage collect if off screen
    if (this.#getPosition() < this.#getStageLeft()) this.markedForDeletion = true;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  #getStageLeft() {
    return 0;
  }
  #getPosition() {
    return this.x + this.width;
  }
}

export default PowerUp;
