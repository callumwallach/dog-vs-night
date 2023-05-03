import { Dust, Fire, Splash } from "./particle.js";
import { MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN, ENTER } from "./constants.js";

const SITTING = "SITTING";
const RUNNING = "RUNNING";
const JUMPING = "JUMPING";
const FALLING = "FALLING";
const ROLLING = "ROLLING";
const DIVING = "DIVING";
const HIT = "HIT";

const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

class Sitting extends State {
  constructor(game) {
    super(SITTING, game);
  }
  enter() {
    this.game.player.speed = 0;
    this.game.player.frameX = 0;
    this.game.player.frameY = 5;
    this.game.player.maxFrame = 4;
  }
  handleInput(input) {
    if (input.includes([MOVE_LEFT, MOVE_RIGHT])) this.game.player.setState(states.RUNNING, 1);
    if (input.includes([ENTER])) this.game.player.setState(states.ROLLING, 2);
  }
}

class Running extends State {
  constructor(game) {
    super(RUNNING, game);
  }
  enter() {
    //this.game.player.speed = this.game.player.maxSpeed;
    this.game.player.frameX = 0;
    this.game.player.frameY = 3;
    this.game.player.maxFrame = 8;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.6,
        this.game.player.y + this.game.player.height
      )
    );
    if (input.includes([MOVE_DOWN])) this.game.player.setState(states.SITTING, 0);
    if (input.includes([MOVE_UP])) this.game.player.setState(states.JUMPING, 1);
    if (input.includes([ENTER])) this.game.player.setState(states.ROLLING, 2);
  }
}

class Jumping extends State {
  constructor(game) {
    super(JUMPING, game);
  }
  enter() {
    if (this.game.player.isOnGround()) this.game.player.vy -= this.game.player.jumpMax;
    //this.game.player.speed = this.game.player.maxSpeed * 0.5;
    this.game.player.frameX = 0;
    this.game.player.frameY = 1;
    this.game.player.maxFrame = 6;
  }
  handleInput(input) {
    // if down arc of jump set to falling
    if (this.game.player.vy > 0) this.game.player.setState(states.FALLING, 1);
    if (input.includes([ENTER])) this.game.player.setState(states.ROLLING, 2);
    if (input.includes([MOVE_DOWN])) this.game.player.setState(states.DIVING, 0);
  }
}

class Falling extends State {
  constructor(game) {
    super(FALLING, game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }
  handleInput(input) {
    if (this.game.player.isOnGround()) this.game.player.setState(states.RUNNING, 1);
    if (input.includes([MOVE_DOWN])) this.game.player.setState(states.DIVING, 0);
  }
}

class Rolling extends State {
  constructor(game) {
    super(ROLLING, game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (!input.includes([ENTER])) {
      if (this.game.player.isOnGround()) this.game.player.setState(states.RUNNING, 1);
      else this.game.player.setState(states.FALLING, 1);
    }
    if (input.includes([MOVE_UP]) && this.game.player.isOnGround()) this.game.player.vy -= this.game.player.jumpMax;
    if (input.includes([MOVE_DOWN]) && !this.game.player.isOnGround()) this.game.player.setState(states.DIVING, 0);
  }
}

class Diving extends State {
  constructor(game) {
    super(DIVING, game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
    this.game.player.vy = 15;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1);
      for (let i = 0; i < 30; i++) {
        this.game.particles.unshift(
          new Splash(
            this.game,
            this.game.player.x + this.game.player.width * 0.5,
            this.game.player.y + this.game.player.height
          )
        );
      }
    }
    if (input.includes([ENTER]) && this.game.player.isOnGround()) this.game.player.setState(states.ROLLING, 2);
  }
}

class Hit extends State {
  constructor(game) {
    super(HIT, game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 4;
    this.game.player.maxFrame = 10;
  }
  handleInput(input) {
    if (!this.#isHit()) {
      if (this.game.player.isOnGround()) this.game.player.setState(states.RUNNING, 1);
      if (!this.game.player.isOnGround()) this.game.player.setState(states.FALLING, 1);
    }
  }
  #isHit() {
    return this.game.player.frameX < 10;
  }
}

export { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit };
