class Enemy {
  constructor(game) {
    this.game = game;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = this.game.fps;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
    this.isPoweredUp = Math.random() > 0.33;
    this.health = 10;
    this.points = 10;
    this.offsetY = 0;
  }
  update(deltaTime) {
    // movement
    this.x -= this.speedX + this.game.speed;
    //console.log(this.x, this.speedX, this.game.speed);
    this.y += this.speedY;
    if (this.frameTimer > this.frameInterval) {
      this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    // garbage collect if off screen
    if (this.getPosition() < this.getStageLeft()) this.markedForDeletion = true;
  }
  draw(context) {
    if (this.game.debug) {
      context.lineWidth = 2;
      context.strokeStyle = "white";
      const hitBox = this.getHitBox();
      context.strokeRect(hitBox.x, hitBox.y, hitBox.width, hitBox.height);
    }
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  getPoints() {
    return this.points;
  }
  getHealth() {
    return this.health;
  }
  damageHealth() {
    return (this.health -= 10);
  }
  getStageRight() {
    return this.game.width;
  }
  getStageLeft() {
    return 0;
  }
  getSkyMax() {
    return -this.height;
  }
  getPosition() {
    return this.x + this.width;
  }
  isAboveSky() {
    return this.y < this.getSkyMax();
  }
  isOnGround() {
    return this.y >= this.getGroundMin();
  }
  getGroundMin() {
    return this.game.height - this.height - this.game.groundMargin;
  }
  getHitBox() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

class FlyingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 60;
    this.height = 44;
    this.x = this.getStageRight() + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemyFly");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
    this.points = 20;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

class GroundEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 60;
    this.height = 87;
    this.x = this.getStageRight();
    this.y = this.getGroundMin();
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 1;
    this.image = document.getElementById("enemyPlant");
    this.points = 10;
  }
  update(deltaTime) {
    super.update(deltaTime);
  }
}

class ClimbingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 120;
    this.height = 144;
    this.x = this.getStageRight();
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 5;
    this.image = document.getElementById("enemySpider");
    this.points = 50;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.isOnGround()) this.speedY *= -1;
    if (this.isAboveSky()) this.markedForDeletion = true;
  }
  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}

export { FlyingEnemy, GroundEnemy, ClimbingEnemy, Enemy };
