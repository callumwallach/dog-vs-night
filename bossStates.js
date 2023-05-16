import { Dust, Fire, Splash } from "./particle.js";

const FLYING = "FLY";
const SHOOTING = "SHOOT";
const DYING = "DIE";

const states = {
  FLYING: 0,
  SHOOTING: 1,
  DYING: 2,
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
    this.game.boss.frameX = 0;
    this.game.boss.frameY = this.frameOrder - 1;
    this.game.boss.maxFrame = this.numberOfFrames - 1;
    this.game.boss.width = this.dimensions.width;
    this.game.boss.height = this.dimensions.height;
    this.game.boss.offsetY = this.dimensions.offsetY;
  }
  getDimensions() {
    return this.dimensions;
  }
}

class Flying extends State {
  constructor(game, appearance) {
    //super(SITTING, game, 6, 5, appearance);
    super(FLYING, game, 6, 8, appearance);
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

class Shooting extends State {
  constructor(game, appearance) {
    //super(RUNNING, game, 4, 9, appearance);
    super(SHOOTING, game, 4, 4, appearance);
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

class Dying extends State {
  constructor(game, appearance) {
    //super(JUMPING, game, 2, 7, appearance);
    super(DYING, game, 2, 2, appearance);
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

export { states, Flying, Shooting, Dying };
