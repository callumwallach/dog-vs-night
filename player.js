// prettier-ignore
import {
  states as PLAYER_STATES,
  Sitting,
  Running,
  Jumping,
  Falling,
  Rolling,
  Hit,
  Diving,
  Empowered,
  KnockedBack,
} from "./playerStates.js";
import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from "./constants.js";
import appearance from "./assets/boy.js";

const RECT = 0;
const ELLIPSE = 1;
const ROTATED_ELLIPSE = 2;

const hitBoxType = RECT;

class Player {
  constructor(game) {
    this.game = game;
    this.width = 0; //100;
    this.height = 0; //91.3;
    this.x = 0;
    this.y = 0; //this.#getGround();
    this.vx = 0;
    this.vy = 0;
    this.weight = 1;
    //this.image = player;
    this.image = document.getElementById(appearance.imageName);
    this.offsetY = null;
    this.frameX = 0;
    this.frameY = 0;
    this.jumpMax = 27;
    // sitting default
    this.maxFrame = 4;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 10;
    this.states = [
      new Sitting(this.game, appearance),
      new Running(this.game, appearance),
      new Jumping(this.game, appearance),
      new Falling(this.game, appearance),
      new Rolling(this.game, appearance),
      new Diving(this.game, appearance),
      new Hit(this.game, appearance),
      new Empowered(this.game, appearance),
      new KnockedBack(this.game, appearance),
    ];
    this.currentState = null;
    this.knockBackMaxX = 30;
    this.knockBackMaxY = 15;
    this.empoweredTimer = 0;
  }
  update(input, deltaTime) {
    this.checkCollisions(deltaTime);
    this.currentState.handleInput(input);
    // horizontal speed
    this.x += this.speed;
    //console.log(this.currentState.constructor.name, input.keys);
    if (this.#isHit()) {
      this.speed = 0;
    } else {
      if (input.includes([MOVE_RIGHT])) {
        this.speed = this.maxSpeed;
      } else if (input.includes([MOVE_LEFT])) {
        this.speed = -this.maxSpeed;
      } else {
        this.speed = 0;
      }
      // console.log(
      //   "speed",
      //   this.speed,
      //   "game speed",
      //   this.game.speed,
      //   "max game speed",
      //   this.game.maxSpeed
      // );
    }
    // horizontal boundaries
    if (this.x < this.#getStageLeft()) this.x = this.#getStageLeft();
    if (this.x > this.#getStageRight()) this.x = this.#getStageRight();
    this.x -= this.vx;
    this.vx = this.vx <= 0 ? 0 : this.vx - this.weight;
    // vertical movement
    this.y += this.vy;
    this.vy = this.isOnGround() ? 0 : this.vy + this.weight;
    // vertical boundaries
    this.y = Math.min(this.y, this.#getGround());
    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    // empowered
    this.empoweredTimer -= deltaTime;
    this.empoweredTimer = Math.max(0, this.empoweredTimer);
    if (this.empoweredTimer === 0 && this.isEmpowered())
      this.currentState.exit();
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
  #getEllipseHitBox() {
    const horizontalCentrePoint = this.x + this.width * 0.55;
    const verticalCentrePoint = this.y + this.height * 0.55;
    const horizontalRadius = this.width / 2.5;
    const verticalRadius = this.height / 2;
    const rotation = 0;
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
      x: this.x + this.width * 0.2,
      y: this.y + this.height * 0.1,
      width: this.width * 0.65,
      height: this.height * 0.9,
    };
  }
  getHitBox() {
    switch (hitBoxType) {
      case RECT:
        return this.#getRectHitBox();
      case ELLIPSE:
        return this.#getEllipseHitBox();
    }
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollisions(deltaTime) {
    this.game.powerUps.forEach((powerUp) => {
      if (
        powerUp.x < this.x + this.width &&
        powerUp.x + powerUp.width > this.x &&
        powerUp.y < this.y + this.height &&
        powerUp.y + powerUp.height > this.y
      ) {
        powerUp.markedForDeletion = true;
        this.setState(PLAYER_STATES.EMPOWERED, 2);
      }
    });
    this.game.projectiles.forEach((projectile) => {
      const hitBox = projectile.getHitBox();
      if (
        hitBox.x < this.x + this.width &&
        hitBox.x + hitBox.width > this.x &&
        hitBox.y < this.y + this.height &&
        hitBox.y + hitBox.height > this.y
      ) {
        projectile.markedForDeletion = true;
        this.setState(PLAYER_STATES.HIT, 0);
        this.game.addPoints(-5, hitBox.x, hitBox.y);
        this.game.loseLife();
      }
    });
    for (let i = 0; i < this.game.enemies.length; i++) {
      const enemy = this.game.enemies[i];
      const hitBox = enemy.getHitBox();
      if (
        hitBox.x < this.x + this.width &&
        hitBox.x + hitBox.width > this.x &&
        hitBox.y < this.y + this.height &&
        hitBox.y + hitBox.height > this.y
      ) {
        const health = enemy.damageHealth();
        if (enemy.constructor.name === "BossEnemy") {
          if (!enemy.isDying()) {
            this.game.addCollision(
              hitBox.x + hitBox.width * 0.5,
              hitBox.y + hitBox.height * 0.5
            );
            if (health <= 0) {
              enemy.setDying();
              if (health === 0) {
                this.game.addPoints(1000, hitBox.x, hitBox.y, 45);
              }
            } else {
              if (this.#isDiving()) {
                const points = this.#isLanding() ? 50 : 100;
                this.game.addPoints(points, hitBox.x, hitBox.y, 35);
              } else if (this.#isRolling() || this.isEmpowered()) {
                const points = Math.floor(Math.random() * 25 + 1);
                this.game.addPoints(points, hitBox.x, hitBox.y, 35);
              } else {
                this.setState(PLAYER_STATES.HIT, 0);
                this.game.addPoints(-5, this.x, this.y - 25, 35);
                this.game.loseLife();
              }
              if (health % (enemy.maxHealth / 5) === 0) {
                const points = Math.floor(Math.random() * 100 + 1);
                this.game.addPoints(points, hitBox.x, hitBox.y, 45);
                this.game.addPowerUpGem(
                  hitBox.x - Math.random() * 500,
                  hitBox.y + Math.random() * hitBox.height
                );
              }
              this.vx = this.knockBackMaxX;
              this.vy = -this.knockBackMaxY;
            }
          }
        } else {
          if (health <= 0) {
            enemy.markedForDeletion = true;
            this.game.addCollision(
              hitBox.x + hitBox.width * 0.5,
              hitBox.y + hitBox.height * 0.5
            );
            if (enemy.isPoweredUp) {
              this.game.addPowerUpGem(
                hitBox.x,
                hitBox.y + hitBox.height * 0.25
              );
            }
            if (this.#isDiving()) {
              const points = this.#isLanding()
                ? enemy.getPoints() * 2
                : enemy.getPoints() * 3;
              this.game.addPoints(points, hitBox.x, hitBox.y);
            } else if (this.#isRolling() || this.isEmpowered()) {
              const points = enemy.getPoints();
              this.game.addPoints(points, hitBox.x, hitBox.y);
            } else {
              this.setState(PLAYER_STATES.HIT, 0);
              this.game.addPoints(-5, this.x, this.y - 25);
              this.game.loseLife();
            }
          }
        }
      }
    }
  }
  isOnGround() {
    return this.y >= this.#getGround();
  }
  #getGround() {
    return this.game.height - this.height - this.game.groundMargin;
  }
  #getStageLeft() {
    return 0;
  }
  #getStageRight() {
    return this.game.width - this.width;
  }
  #isRolling() {
    return (
      this.currentState === this.states[PLAYER_STATES.ROLLING] ||
      this.currentState === this.states[PLAYER_STATES.DIVING]
    );
  }
  #isKnockedBack() {
    return this.currentState === this.states[PLAYER_STATES.KNOCKED];
  }
  #isSitting() {
    return this.currentState === this.states[PLAYER_STATES.SITTING];
  }
  isEmpowered() {
    return this.currentState === this.states[PLAYER_STATES.EMPOWERED];
  }
  #isDiving() {
    return this.currentState === this.states[PLAYER_STATES.DIVING];
  }
  #isLanding() {
    return this.vy > this.jumpMax - this.jumpMax * 0.1;
  }
  #isHit() {
    return this.currentState === this.states[PLAYER_STATES.HIT];
  }
}

export default Player;
