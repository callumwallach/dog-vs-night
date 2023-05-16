import { Dying, Flying, Shooting } from "./bossStates.js";
import { Enemy } from "./enemies.js";
import appearance from "./assets/enemy_boss.js";
import { Blast, Ice } from "./particle.js";

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
    this.states = [
      new Flying(this.game, appearance),
      new Shooting(this.game, appearance),
      new Dying(this.game, appearance),
    ];
    this.currentState = null;
    this.dead = false;
    this.isThreatening = false;
    this.isShooting = false;
    this.isFlying = true;
    this.isDying = false;
    this.threatTimer = 0;
    this.threatInterval = 50;
    this.shootTimer = 0;
    this.shootInterval = 50;
  }
  update(deltaTime) {
    // movement
    //console.log(this.x, this.getStageRight());
    if (this.dead) {
      this.markedForDeletion = true;
      setTimeout(() => {
        this.game.success = true;
        this.game.gameOver = true;
      }, 750);
    } else if (this.isDying && this.frameX === this.maxFrame - 1) {
      this.dead = true;
    } else {
      this.x =
        this.x < this.getStageRight() - this.width ||
        this.isShooting ||
        this.isThreatening
          ? this.x
          : this.x - this.speedX - 2;
      this.y += this.speedY;
      if (this.frameTimer > this.frameInterval) {
        this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
        this.frameTimer = 0;
        if (this.isThreatening) {
          if (this.frameX === this.maxFrame - 1) this.shoot();
        } else if (this.isShooting) {
          if (this.frameX === Math.floor(this.maxFrame / 2)) {
            this.game.projectiles.unshift(
              new Blast(
                this.game,
                this.x,
                this.y + this.height * 0.5 * Math.random() + this.height * 0.5
              )
            );
          }
          if (this.frameX === this.maxFrame - 1) this.fly();
        } else {
          this.shootTimer++;
          if (this.shootTimer > this.shootInterval) {
            this.threat();
            this.shootTimer = 0;
          }
        }
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
      const rectHitBox = this.getHitBox();
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
    let theX = this.x;
    let theY = this.y;
    if (this.isShooting) {
      theX = this.x - 74;
      theY = this.y + 25;
    }
    if (this.isThreatening) {
      theX = this.x + 7;
      theY = this.y - 47;
    }
    if (!this.dead) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.offsetY ? this.offsetY : this.frameY * this.height,
        this.width,
        this.height,
        theX,
        theY,
        this.width,
        this.height
      );
    }
  }
  fly() {
    this.width = 293;
    this.height = 350;
    this.offsetY = 1;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 7;
    this.isThreatening = false;
    this.isFlying = true;
    this.isShooting = false;
    this.isDying = false;
  }
  shoot() {
    this.width = 440;
    this.height = 348;
    this.offsetY = 353;
    this.frameX = 0;
    this.frameY = 1;
    this.maxFrame = 8;
    this.isThreatening = false;
    this.isShooting = true;
    this.isFlying = false;
    this.isDying = false;
  }
  threat() {
    this.width = 332;
    this.height = 396;
    this.offsetY = 703;
    this.frameX = 0;
    this.frameY = 1;
    this.maxFrame = 8;
    this.isThreatening = true;
    this.isShooting = false;
    this.isFlying = false;
    this.isDying = false;
  }
  death() {
    this.frameInterval = 2000 / this.fps;
    this.width = 331;
    this.height = 380;
    this.offsetY = 1101;
    this.frameX = 0;
    this.frameY = 3;
    this.maxFrame = 12;
    this.isThreatening = false;
    this.isShooting = false;
    this.isFlying = false;
    this.isDying = true;
  }
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
    if (this.isFlying)
      return {
        x: this.x + this.width * 0.15,
        y: this.y + this.height * 0.1,
        width: this.width * 0.6,
        height: this.height * 0.85,
      };
    if (this.isShooting)
      return {
        x: this.x - this.width * 0.1,
        y: this.y + this.height * 0.1,
        width: this.width * 0.6,
        height: this.height * 0.85,
      };
    if (this.isThreatening)
      return {
        x: this.x + this.width * 0.15,
        y: this.y - this.height * 0.1,
        width: this.width * 0.6,
        height: this.height * 0.85,
      };
    if (this.isDying)
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
