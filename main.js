import UI from "./UI.js";
import Loading from "./loading.js";
import Player from "./player.js";
import InputHandler from "./input.js";
import Background from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import BossEnemy from "./boss.js";
import FloatingMessages from "./floatingMessage.js";
import PowerUp from "./powerUp.js";
import {
  CollisionAnimation,
  ExplosionAnimation,
} from "./collisionAnimation.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1200;
  canvas.height = 500;
  const maxLives = 5;
  let newGame = true;
  let lastTime = 0;
  let animationRequest;
  const maxTime = 3 * 60 * 1000;
  const enemyInterval = 2 * 1000;
  const bossInterval = 1 * 60 * 1000;
  const bossMaxHealth = 250;
  const fullScreenButton = document.getElementById("fullScreenButton");

  class Game {
    constructor(width, height) {
      this.debug = false;
      this.width = width;
      this.height = height;
      this.groundMargin = 40;
      this.isLoading = true;
      this.maxParticles = 50;
      this.enemyInterval = enemyInterval;
      this.bossInterval = bossInterval;
      this.bossMaxHealth = bossMaxHealth;
      this.fontColor = "black";
      this.maxTime = maxTime;
      this.init();
    }
    update(deltaTime) {
      //console.log("running", this.time, deltaTime);
      this.time += deltaTime;
      if (this.bossStage) {
        this.speed = 0;
        this.maxSpeed = 0;
      }
      //if (this.time > this.maxTime) this.gameOver = true;
      this.background.update();
      this.player.update(this.input, deltaTime);
      // handle enemies
      if (!this.bossStage && this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      if (!this.bossStage && this.time > this.bossInterval) {
        this.addBoss();
      }
      this.enemies.forEach((enemy, index) => {
        enemy.update(deltaTime);
      });
      // handle messages
      this.floatingMessages.forEach((message) => message.update());
      // handle projectiles
      this.projectiles.forEach((projectile) => projectile.update());
      // handle particles
      this.particles.forEach((particle, index) => particle.update());
      this.particles.length = Math.min(
        this.particles.length,
        this.maxParticles
      );
      // handle power ups
      this.powerUps.forEach((powerUp, index) => powerUp.update(deltaTime));
      // handle collision sprites
      this.collisions.forEach((collision, index) =>
        collision.update(deltaTime)
      );
      // clean up
      this.powerUps = this.powerUps.filter(
        (powerUp) => !powerUp.markedForDeletion
      );
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
      this.particles = this.particles.filter(
        (particle) => !particle.markedForDeletion
      );
      this.collisions = this.collisions.filter(
        (collision) => !collision.markedForDeletion
      );
      this.floatingMessages = this.floatingMessages.filter(
        (message) => !message.markedForDeletion
      );
      //console.log(this.enemies, this.particles);
    }
    draw(context) {
      this.background.draw(context);
      this.powerUps.forEach((powerUp) => powerUp.draw(context));
      this.player.draw(context);
      this.enemies.forEach((enemy) => enemy.draw(context));
      this.projectiles.forEach((projectile) => projectile.draw(context));
      this.particles.forEach((particle) => particle.draw(context));
      this.collisions.forEach((collision) => collision.draw(context));
      this.floatingMessages.forEach((message) => message.draw(context));
      this.UI.draw(context);
    }
    addEnemy() {
      if (this.speed > 0)
        this.enemies.push(
          Math.random() < 0.5 ? new GroundEnemy(this) : new ClimbingEnemy(this)
        );
      this.enemies.push(new FlyingEnemy(this));
    }
    addBoss() {
      this.bossStage = true;
      this.boss = new BossEnemy(this, this.bossMaxHealth);
      this.enemies.push(this.boss);
    }
    addPoints(points, x, y, size = 20) {
      this.score += points;
      this.floatingMessages.push(
        new FloatingMessages(
          `${points > 0 ? "+" : ""}${points}`,
          x,
          y,
          150,
          50,
          size
        )
      );
    }
    addCollision(x, y) {
      this.collisions.push(new CollisionAnimation(this, x, y));
    }
    addExplosion(x, y) {
      this.collisions.push(new ExplosionAnimation(this, x, y));
    }
    addPowerUpGem(x, y) {
      this.powerUps.push(new PowerUp(this, x, y));
    }
    loseLife() {
      this.lives--;
      if (this.lives <= 0) this.gameOver = true;
    }
    init() {
      this.speed = 0;
      this.maxSpeed = 4;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.background = new Background(this);
      this.UI = new UI(this);
      this.loading = new Loading(this);
      this.enemies = [];
      this.projectiles = [];
      this.particles = [];
      this.collisions = [];
      this.powerUps = [];
      this.floatingMessages = [];
      this.enemyTimer = 0;
      this.bossStage = false;
      this.boss = null;
      this.score = 0;
      this.time = 0;
      this.gameOver = false;
      this.success = false;
      this.lives = maxLives;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    startNewGame() {
      cancelAnimationFrame(animationRequest);
      newGame = true;
      this.init();
      // const audioObj = new Audio("/assets/background.mp3");
      // audioObj.play();
      animationRequest = requestAnimationFrame(animate);
    }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      canvas
        .requestFullscreen()
        .catch((err) =>
          alert(`Error, can't enable full screen mode: ${err.message}`)
        );
    } else {
      document.exitFullscreen();
    }
  }
  fullScreenButton.addEventListener("click", toggleFullScreen);

  const game = new Game(canvas.width, canvas.height);

  function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    if (newGame) {
      deltaTime = 0;
      newGame = false;
    }
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) animationRequest = requestAnimationFrame(animate);
  }

  function run() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.background.draw(ctx);
    game.loading.draw(ctx);
    window.addEventListener(
      "keydown",
      (e) => {
        game.startNewGame();
      },
      { once: true }
    );
  }
  run();
});
