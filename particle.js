class Particle {
  constructor(game) {
    this.game = game;
    this.markedForDeletion = false;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) this.markedForDeletion = true;
  }
}

class Dust extends Particle {
  constructor(game, x, y) {
    super(game);
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "rgba(0,0,0,0.2)";
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}
class Splash extends Particle {
  constructor(game, x, y) {
    super(game);
    this.image = document.getElementById("fire");
    this.size = Math.random() * 100 + 100;
    this.x = x - this.size * 0.4;
    this.y = y - this.size * 0.5;
    this.speedX = Math.random() * 6 - 4;
    this.speedY = Math.random() * 2 + 1;
    this.gravity = 0;
    this.va = Math.random() * 0.2 - 0.1;
  }
  update() {
    super.update();
    this.gravity += 0.1;
    this.y += this.gravity;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

class Fire extends Particle {
  constructor(game, x, y) {
    super(game);
    this.image = document.getElementById("fire");
    this.size = Math.random() * 100 + 100;
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.va = Math.random() * 0.2 - 0.1;
  }
  update() {
    super.update();
    this.angle += this.va;
    this.x += Math.sin(this.angle * 5);
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    );
    context.restore();
  }
}

class Ice extends Particle {
  constructor(game, x, y) {
    super(game);
    this.image = document.getElementById("ice");
    this.size = Math.random() * 100 + 100;
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.va = Math.random() * 0.2 - 0.1;
  }
  update() {
    //super.update();
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.97;
    if (this.size < 25) this.markedForDeletion = true;
    this.angle += this.va;
    this.x += Math.sin(this.angle * 5);
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size * 1.15,
      this.size * 0.75
    );
    context.restore();
  }
}

class Blast extends Particle {
  constructor(game, x, y) {
    super(game);
    this.image = document.getElementById("blast");
    this.size = 150; //Math.random() * 100 + 100;
    this.x = x;
    this.y = y;
    this.speedX = 10;
    this.speedY = 1;
    this.angle = 0;
    this.va = Math.random() * 0.2 - 0.1;
  }
  update() {
    //super.update();
    this.x -= this.speedX; // + this.game.speed;
    //this.y -= this.speedY;
    //this.size *= 0.95;
    this.angle += this.va;
    //this.x -= 1; //+= Math.sin(this.angle * 5);
    if (this.x < 0) this.markedForDeletion = true;
    this.game.particles.unshift(
      new Ice(this.game, this.x - this.size * 0.25, this.y - this.size * 0.2)
    );
  }
  draw(context) {
    context.save();

    if (this.game.debug) {
      context.lineWidth = 2;
      context.strokeStyle = "white";
      context.beginPath();
      const hitBox = this.getHitBox();
      context.strokeRect(hitBox.x, hitBox.y, hitBox.width, hitBox.height);
    }
    context.translate(this.x, this.y);

    //context.rotate(90);
    // context.drawImage(
    //   this.image,
    //   -this.size * 0.5,
    //   -this.size * 0.5,
    //   this.size * 0.1, //0.75,
    //   this.size * 0.1 //0.5
    // );
    context.restore();
  }
  getHitBox() {
    return {
      //x: this.x - this.size * 0.5,
      x: this.x - this.size * 0.25,
      y: this.y - this.size * 0.5,
      //width: this.size * 0.75,
      width: this.size * 1.125,
      height: this.size * 0.5,
    };
  }
}

export { Dust, Splash, Fire, Ice, Blast };
