import {
  states as BOSS_STATES,
  Dying,
  Flying,
  Shooting,
  Threatening,
} from "./bossStates.js";
import { Enemy } from "./enemies.js";
import appearance from "./assets/enemy_boss.js";
import { Blast, Ice } from "./particle.js";

const RECT = 0;
const ELLIPSE = 1;
const ROTATED_ELLIPSE = 2;

const hitBoxType = RECT;

class BossEnemy extends Enemy {
  constructor(game, maxHealth = 250) {
    super(game);
    this.width = 293;
    this.height = 350;
    this.x = this.getStageRight();
    this.y = this.getGroundMin();
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 7;
    this.image = document.getElementById("enemyBoss");
    this.maxHealth = maxHealth;
    this.health = this.maxHealth;
    this.states = [
      new Flying(this.game, appearance),
      new Threatening(this.game, appearance),
      new Shooting(this.game, appearance),
      new Dying(this.game, appearance),
    ];
    this.currentState = this.states[0];
    this.dead = false;
    this.shootTimer = 0;
    this.shootInterval = 50;
  }
  update(deltaTime) {
    // position boss
    this.x =
      this.x < this.game.width * 0.75 ? this.x : this.x - this.speedX - 2;
    // advance frame
    if (this.frameTimer > this.frameInterval) {
      if (this.isDying() || this.#isThreatening() || this.#isShooting()) {
        if (this.frameX < this.maxFrame) {
          //console.log("frame", this.frameX, this.currentState.constructor.name);
          this.frameX++;
          if (this.isDying() && this.frameX % 2 === 0) {
            this.game.addCollision(
              this.x + this.width * 0.5,
              this.y + this.height * 0.5
            );
          }
        } else {
          this.currentState.next();
        }
        if (
          this.#isShooting() &&
          this.frameX === Math.floor(this.maxFrame / 2)
        ) {
          this.game.projectiles.unshift(
            new Blast(
              this.game,
              this.x,
              this.y + this.height * 0.5 * Math.random() + this.height * 0.5
            )
          );
        }
      } else {
        this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
      }
      this.frameTimer = 0;

      this.shootTimer++;
      if (this.shootTimer > this.shootInterval && !this.isDying()) {
        this.setState(BOSS_STATES.THREATENING);
        this.shootTimer = 0;
      }
    } else {
      this.frameTimer += deltaTime;
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
    if (this.#isShooting() /* || this.isShooting */) {
      theX = this.x - 74;
      theY = this.y + 25;
    }
    if (this.#isThreatening() /*|| this.isThreatening */) {
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
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
  setDying() {
    //console.log("current state", this.currentState.constructor.name);
    this.currentState = this.states[BOSS_STATES.DYING];
    this.currentState.enter();
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
    if (this.#isFlying()) {
      return {
        x: this.x + this.width * 0.15,
        y: this.y + this.height * 0.1,
        width: this.width * 0.6,
        height: this.height * 0.85,
      };
    } else if (this.#isShooting()) {
      return {
        x: this.x - this.width * 0.1,
        y: this.y + this.height * 0.1,
        width: this.width * 0.6,
        height: this.height * 0.85,
      };
    } else if (this.#isThreatening()) {
      return {
        x: this.x + this.width * 0.15,
        y: this.y - this.height * 0.1,
        width: this.width * 0.6,
        height: this.height * 0.85,
      };
    } else if (this.isDying()) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
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
  #isFlying() {
    return this.currentState === this.states[BOSS_STATES.FLYING];
  }
  #isShooting() {
    return this.currentState === this.states[BOSS_STATES.SHOOTING];
  }
  #isThreatening() {
    return this.currentState === this.states[BOSS_STATES.THREATENING];
  }
  isDying() {
    return this.currentState === this.states[BOSS_STATES.DYING];
  }
}

export default BossEnemy;
