const FLYING = "FLY";
const THREATENING = "THREATEN";
const SHOOTING = "SHOOT";
const DYING = "DIE";

const states = {
  FLYING: 0,
  THREATENING: 1,
  SHOOTING: 2,
  DYING: 3,
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
    super(FLYING, game, 0, 8, appearance);
  }
  enter() {
    super.enter();
  }
  next() {}
}

class Threatening extends State {
  constructor(game, appearance) {
    super(THREATENING, game, 2, 8, appearance);
  }
  enter() {
    super.enter();
  }
  next() {
    this.game.boss.setState(states.SHOOTING);
  }
}

class Shooting extends State {
  constructor(game, appearance) {
    super(SHOOTING, game, 1, 8, appearance);
  }
  enter() {
    super.enter();
  }
  next() {
    this.game.boss.setState(states.FLYING);
  }
}

class Dying extends State {
  constructor(game, appearance) {
    super(DYING, game, 4, 12, appearance);
  }
  enter() {
    super.enter();
  }
  next() {
    this.game.boss.dead = true;
    this.game.boss.markedForDeletion = true;
    setTimeout(() => {
      this.game.success = true;
      this.game.gameOver = true;
    }, 750);
  }
}

export { states, Flying, Threatening, Shooting, Dying };
