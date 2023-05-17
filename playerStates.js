import { Dust, Fire, Splash } from "./particle.js";
import {
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
  MOVE_DOWN,
  ENTER,
} from "./constants.js";

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
  EMPOWERED: 7,
  KNOCKED: 8,
};

class State {
  constructor(state, game, frameOrder, numberOfFrames, appearance) {
    this.state = state;
    this.game = game;
    this.frameOrder = frameOrder;
    this.numberOfFrames = numberOfFrames;
    const { w, h, y } = appearance.frames[state].frame;
    this.dimensions = {
      width: w / this.numberOfFrames,
      height: h,
      offsetY: y,
    };
  }
  enter() {
    //console.log("enter", this.state, this.dimensions);
    this.game.player.frameX = 0;
    this.game.player.frameY = this.frameOrder - 1;
    this.game.player.maxFrame = this.numberOfFrames - 1;
    this.game.player.width = this.dimensions.width;
    this.game.player.height = this.dimensions.height;
    this.game.player.offsetY = this.dimensions.offsetY;
  }
  getDimensions() {
    return this.dimensions;
  }
}

class Sitting extends State {
  constructor(game, appearance) {
    //super(SITTING, game, 6, 5, appearance);
    super(SITTING, game, 6, 8, appearance);
  }
  enter() {
    super.enter();
    this.game.player.speed = 0;
  }
  handleInput(input) {
    if (input.includes([MOVE_UP])) this.game.player.setState(states.JUMPING, 1);
    if (input.includes([MOVE_LEFT, MOVE_RIGHT]))
      this.game.player.setState(states.RUNNING, 1);
    if (input.includes([ENTER])) this.game.player.setState(states.ROLLING, 2);
  }
}

class Running extends State {
  constructor(game, appearance) {
    //super(RUNNING, game, 4, 9, appearance);
    super(RUNNING, game, 4, 4, appearance);
  }
  enter() {
    super.enter();
  }
  handleInput(input) {
    if (this.game.bossStage && input.keys.length === 0) {
      this.game.player.setState(states.SITTING, 0);
    } else {
      this.game.particles.unshift(
        new Dust(
          this.game,
          this.game.player.x + this.game.player.width * 0.6,
          this.game.player.y + this.game.player.height
        )
      );
      if (input.includes([MOVE_DOWN]))
        this.game.player.setState(states.SITTING, 0);
      if (input.includes([MOVE_UP]))
        this.game.player.setState(states.JUMPING, 1);
      if (input.includes([ENTER])) this.game.player.setState(states.ROLLING, 2);
    }
  }
}

class Jumping extends State {
  constructor(game, appearance) {
    //super(JUMPING, game, 2, 7, appearance);
    super(JUMPING, game, 2, 2, appearance);
  }
  enter() {
    super.enter();
    if (this.game.player.isOnGround())
      this.game.player.vy -= this.game.player.jumpMax;
  }
  handleInput(input) {
    // if down arc of jump set to falling
    if (this.game.player.vy > 0) this.game.player.setState(states.FALLING, 1);
    if (input.includes([ENTER])) this.game.player.setState(states.ROLLING, 2);
    if (input.includes([MOVE_DOWN]))
      this.game.player.setState(states.DIVING, 0);
  }
}

class Falling extends State {
  constructor(game, appearance) {
    //super(FALLING, game, 3, 7, appearance);
    super(FALLING, game, 3, 2, appearance);
  }
  enter() {
    super.enter();
  }
  handleInput(input) {
    if (this.game.player.isOnGround())
      this.game.player.setState(states.RUNNING, 1);
    if (input.includes([MOVE_DOWN]))
      this.game.player.setState(states.DIVING, 0);
  }
}

class Rolling extends State {
  constructor(game, appearance) {
    //super(ROLLING, game, 7, 7, appearance);
    super(ROLLING, game, 7, 3, appearance);
    // this.sound = new Audio();
    // this.sound.src = "./assets/fire.ogg";
    // this.sound.loop = true;
  }
  enter() {
    super.enter();
    //this.sound.play();
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
      if (this.game.player.isOnGround())
        this.game.player.setState(states.RUNNING, 1);
      else this.game.player.setState(states.FALLING, 1);
    }
    if (input.includes([MOVE_UP]) && this.game.player.isOnGround())
      this.game.player.vy -= this.game.player.jumpMax;
    if (input.includes([MOVE_DOWN]) && !this.game.player.isOnGround())
      this.game.player.setState(states.DIVING, 0);
  }
}

class Empowered extends State {
  constructor(game, appearance) {
    //super(ROLLING, game, 7, 7, appearance);
    super(ROLLING, game, 7, 3, appearance);
    // this.sound = new Audio();
    // this.sound.src = "./assets/fire.wav";
    // this.sound.loop = true;
  }
  enter() {
    super.enter();
    //this.sound.play();
    this.empowered = true;
    const EMPOWERED_TIME = 10 * 1000;
    this.game.player.empoweredTimer = EMPOWERED_TIME;
    // setTimeout(() => {
    //     console.log("removing empower");
    //     this.empowered = false;
    // }, EMPOWERED_TIME);
  }
  exit() {
    this.empowered = false;
    // this.sound.pause();
    // this.sound.currentTime = 0;
  }
  handleInput(input) {
    //this.timer = this.timer > 0 ? this.timer - 1 : 0;
    //if (this.timer <= 0) this.empowered = false;
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (!this.empowered) {
      if (this.game.player.isOnGround())
        this.game.player.setState(states.RUNNING, 1);
      else this.game.player.setState(states.FALLING, 1);
    }
    if (input.includes([MOVE_UP]) && this.game.player.isOnGround())
      this.game.player.vy -= this.game.player.jumpMax;
    if (input.includes([MOVE_DOWN]) && !this.game.player.isOnGround())
      this.game.player.setState(states.DIVING, 0);
  }
}

class Diving extends State {
  constructor(game, appearance) {
    //super(DIVING, game, 7, 7, appearance);
    super(DIVING, game, 7, 3, appearance);
  }
  enter() {
    super.enter();
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
    if (input.includes([ENTER]) && this.game.player.isOnGround())
      this.game.player.setState(states.ROLLING, 2);
  }
}

class Hit extends State {
  constructor(game, appearance) {
    super(HIT, game, 5, 11, appearance);
  }
  enter() {
    super.enter();
  }
  handleInput(input) {
    if (!this.isHit()) {
      if (this.game.player.isOnGround())
        this.game.player.setState(states.RUNNING, 1);
      if (!this.game.player.isOnGround())
        this.game.player.setState(states.FALLING, 1);
    }
  }
  isHit() {
    return this.game.player.frameX < 10;
  }
}

class KnockedBack extends State {
  constructor(game, appearance) {
    super(HIT, game, 5, 11, appearance);
  }
  enter() {
    super.enter();
    this.game.player.vx = this.game.player.knockBackMaxX;
    this.game.player.vy = -this.game.player.knockBackMaxY;
    // console.log(
    //   this.game.player.x,
    //   this.game.player.vx,
    //   this.game.player.y,
    //   this.game.player.vy
    // );
  }
  handleInput(input) {
    if (!this.isKnockedBack()) {
      if (this.game.player.isOnGround())
        this.game.player.setState(states.RUNNING, 1);
      if (!this.game.player.isOnGround())
        this.game.player.setState(states.FALLING, 1);
    }
  }
  isKnockedBack() {
    return this.game.player.frameX < 10;
  }
}

export {
  states,
  Sitting,
  Running,
  Jumping,
  Falling,
  Rolling,
  Diving,
  Hit,
  Empowered,
  KnockedBack,
};
