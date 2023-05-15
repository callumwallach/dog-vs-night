import { Enemy } from "./enemies.js";

const RECT = 0;
const ELLIPSE = 1;
const ROTATED_ELLIPSE = 2;

const hitBoxType = RECT;

class BossEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 293;
    this.height = 350;
    this.x = this.getStageRight();
    this.y = this.getGroundMin();
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 7;
    this.image = document.getElementById("enemyBoss");
    this.maxHealth = 250;
    this.health = this.maxHealth;
    this.deathTimer = 0;
  }
  update(deltaTime) {
    // movement
    //console.log(this.x, this.getStageRight());
    if (this.dead && this.frameX === this.maxFrame - 1) {
      this.markedForDeletion = true;
      setTimeout(() => {
        this.game.success = true;
        this.game.gameOver = true;
      }, 750);
    } else {
      this.x =
        this.x < this.getStageRight() - this.width
          ? this.x
          : this.x - this.speedX - 2;
      this.y += this.speedY;
      if (this.frameTimer > this.frameInterval) {
        this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      //console.log(this.frameX);
      // garbage collect if off screen
      if (this.getPosition() < this.getStageLeft())
        this.markedForDeletion = true;
    }
  }
  draw(context) {
    if (this.game.debug) {
      context.lineWidth = 2;
      context.strokeStyle = "white";
      context.beginPath();
      const rectHitBox = this.#getRectHitBox();
      context.rect(
        rectHitBox.x,
        rectHitBox.y,
        rectHitBox.width,
        rectHitBox.height
      );
      context.stroke();
      // const ellipseHitBox = this.#getEllipseHitBox();
      // context.beginPath();
      // context.ellipse(
      //   ellipseHitBox.x,
      //   ellipseHitBox.y,
      //   ellipseHitBox.radiusX,
      //   ellipseHitBox.radiusY,
      //   ellipseHitBox.rotation,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();
    }
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.offsetY ? this.offsetY : this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  death() {
    this.dead = true;
    this.frameInterval = 2000 / this.fps;
    this.width = 331;
    this.height = 380;
    this.offsetY = 1101;
    this.frameX = 0;
    this.frameY = 3;
    this.maxFrame = 12;
  }
  // death(deltaTime) {
  //   if (this.frameTimer > this.frameInterval) {
  //     this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
  //     this.frameTimer = 0;
  //   } else {
  //     this.frameTimer += deltaTime;
  //   }
  // }
  #getEllipseHitBox() {
    const horizontalCentrePoint = this.x + this.width * 0.45;
    const verticalCentrePoint = this.y + this.height * 0.53;
    const horizontalRadius = this.width / 2.9;
    const verticalRadius = this.height / 2.25;
    const rotation = 0;
    return {
      x: horizontalCentrePoint,
      y: verticalCentrePoint,
      radiusX: horizontalRadius,
      radiusY: verticalRadius,
      rotation,
    };
  }
  #getRotatedEllipseHitBox() {
    const horizontalCentrePoint = this.x + this.width * 0.55;
    const verticalCentrePoint = this.y + this.height * 0.5;
    const horizontalRadius = this.width / 2.9;
    const verticalRadius = this.height / 2.25;
    const rotation = (Math.PI / 4) * 3.65;
    return {
      x: horizontalCentrePoint,
      y: verticalCentrePoint,
      radiusX: horizontalRadius,
      radiusY: verticalRadius,
      rotation,
    };
  }
  #getRectHitBox() {
    return {
      x: this.x + this.width * 0.15,
      y: this.y + this.height * 0.1,
      width: this.width * 0.6,
      height: this.height * 0.85,
    };
  }
  getHitBox() {
    return this.#getRectHitBox();
    // switch (hitBoxType) {
    //   case ELLIPSE:
    //     return this.#getEllipseHitBox();
    //   case ROTATED_ELLIPSE:
    //     return this.#getRotatedEllipseHitBox();
    //   case RECT:
    //   default:
    //     return this.#getRectHitBox();
    // }
  }
}

export default BossEnemy;
