import { Sitting, Running, Jumping, Falling, Rolling, Hit, Diving } from "./playerStates.js";
import CollisionAnimation from "./collectionAnimation.js";
import { MOVE_UP, MOVE_LEFT, MOVE_RIGHT } from "./constants.js";
import FloatingMessages from "./floatingMessage.js";

class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.#getGround();
    this.vy = 0;
    this.weight = 1;
    //this.image = player;
    this.image = document.getElementById("player");
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
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
    this.currentState = null;
  }
  update(input, deltaTime) {
    this.checkCollisions();
    this.currentState.handleInput(input);
    // horizontal speed
    this.x += this.speed;
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
    }
    // horizontal boundaries
    if (this.x < this.#getStageLeft()) this.x = this.#getStageLeft();
    if (this.x > this.#getStageRight()) this.x = this.#getStageRight();
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
  }
  draw(context) {
    if (this.game.debug) {
      context.strokeStyle = "white";
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollisions() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markedForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5)
        );
        if (this.#isRolling()) {
          this.game.score++;
          this.game.floatingMessages.push(new FloatingMessages("+1", enemy.x, enemy.y, 150, 50));
        } else if (this.#isDiving()) {
          const points = this.#isLanding() ? 5 : 10;
          this.game.score += points;
          this.game.floatingMessages.push(new FloatingMessages(`+${points}`, enemy.x, enemy.y, 150, 50));
        } else {
          this.setState(6, 0);
          this.game.score -= 5;
          this.game.floatingMessages.push(new FloatingMessages("-5", enemy.x, enemy.y, 150, 50));
          this.game.lives--;
          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    });
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
    return this.currentState === this.states[4]; //|| this.currentState === this.states[5];
  }
  #isDiving() {
    return this.currentState === this.states[5];
  }
  #isLanding() {
    return this.vy > this.jumpMax - this.jumpMax * 0.1;
  }
  #isHit() {
    return this.currentState === this.states[6];
  }
}

export default Player;
