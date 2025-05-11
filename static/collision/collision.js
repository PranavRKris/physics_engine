let mode = "1d";
let balls = [];
let isRunning = false;
let menuInputs = {
  mass1: "2",
  mass2: "4",
  speed: "2",
  ballCount: "5",
};
let selectedInput = null;
let startBtnArea = { x: 100, y: 300, w: 100, h: 40 };

let cursorVisible = true;
let lastCursorToggle = 0;
const cursorBlinkRate = 500; // ms

function setup() {
  createCanvas(window.innerWidth, 600).parent("canvas-holder");
  frameRate(60);
}

function draw() {
  noStroke();
  background(30);
  fill(255);
  textSize(16);
  textAlign(LEFT);

  if (!isRunning) {
    drawMenu();
    return;
  }

  if (mode === "1d") {
    // Draw static wall and floor only in 1D mode
    stroke(100);
    line(0, height / 2 + 20, width, height / 2 + 20);

    fill(100);
    noStroke();
    rect(0, height / 2 - 60, 10, 80);
  }

  text(
    `Mode: ${mode.toUpperCase()} | Click canvas to restart`,
    10,
    height - 10
  );

  for (let ball of balls) {
    ball.update();
    ball.display();
  }

  if (mode === "1d") handle1DCollision();
  else handle2DCollisions();
}

function mousePressed() {
  if (isRunning) {
    initSimulation();
    return;
  }

  const previousInput = selectedInput;
  selectedInput = null;

  if (mode === "1d") {
    if (mouseInside(100, 120, 120, 30)) selectedInput = "mass1";
    else if (mouseInside(100, 180, 120, 30)) selectedInput = "mass2";
    else if (mouseInside(100, 240, 120, 30)) selectedInput = "speed";
  } else {
    if (mouseInside(100, 180, 120, 30)) selectedInput = "ballCount";
  }

  if (selectedInput && selectedInput !== previousInput) {
    menuInputs[selectedInput] = "";
  }

  if (
    mouseInside(startBtnArea.x, startBtnArea.y, startBtnArea.w, startBtnArea.h)
  ) {
    isRunning = true;
    initSimulation();
  }
}

function keyPressed() {
  if (selectedInput && key >= "0" && key <= "9") {
    menuInputs[selectedInput] += key;
  } else if (selectedInput && keyCode === BACKSPACE) {
    menuInputs[selectedInput] = menuInputs[selectedInput].slice(0, -1);
  } else if (selectedInput && keyCode === ESCAPE) {
    selectedInput = null;
  }
}

function changeMode(selected) {
  mode = selected;
  isRunning = false;
  selectedInput = null;

  // Reset menuInputs to default
  menuInputs = {
    mass1: "2",
    mass2: "4",
    speed: "2",
    ballCount: "5",
  };
}

function drawMenu() {
  background(30); // clear canvas for redrawing
  textSize(20);
  fill(255);
  textAlign(LEFT);

  if (mode === "1d") {
    text("1D Collision Setup", 100, 60);
    drawInputField("Mass 1:", menuInputs.mass1, 100, 90, "mass1");
    drawInputField("Mass 2:", menuInputs.mass2, 100, 150, "mass2");
    drawInputField("Speed:", menuInputs.speed, 100, 210, "speed");
  } else {
    text("2D Collision Setup", 100, 80);
    drawInputField(
      "Number of Balls:",
      menuInputs.ballCount,
      100,
      150,
      "ballCount"
    );
  }

  drawStartButton();
}

function drawInputField(label, value, x, y, key) {
  // Label
  noStroke();
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(label, x, y);

  // Input box
  fill(255);
  rect(x, y + 20, 120, 30, 5);

  // Text inside the box
  fill(0);
  textAlign(LEFT, CENTER);
  let displayValue = value;

  if (selectedInput === key) {
    if (millis() - lastCursorToggle > cursorBlinkRate) {
      cursorVisible = !cursorVisible;
      lastCursorToggle = millis();
    }
    if (cursorVisible) displayValue += "|";
  }

  text(displayValue, x + 5, y + 35);
}

function drawStartButton() {
  fill(100, 200, 100);
  rect(startBtnArea.x, startBtnArea.y, startBtnArea.w, startBtnArea.h, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  text(
    "Start",
    startBtnArea.x + startBtnArea.w / 2,
    startBtnArea.y + startBtnArea.h / 2
  );
}

function mouseInside(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

function initSimulation() {
  if (mode === "1d") setup1D();
  else setup2D();
}

class Ball {
  constructor(x, y, r, m, vx, vy, col) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.m = m;
    this.vx = vx;
    this.vy = vy;
    this.col = col;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wall bounce for 1D (left wall at x = 10)
    if (mode === "1d" && this.x - this.r < 10) {
      this.x = 10 + this.r;
      this.vx *= -1;
    }

    if (mode === "2d") {
      if (this.x - this.r < 0 || this.x + this.r > width) this.vx *= -1;
      if (this.y - this.r < 0 || this.y + this.r > height) this.vy *= -1;
    }
  }

  display() {
    fill(this.col);
    stroke(255);
    strokeWeight(2);
    ellipse(this.x, this.y, this.r * 2);
  }
}

function setup1D() {
  balls = [];
  let m1 = parseFloat(menuInputs.mass1);
  let m2 = parseFloat(menuInputs.mass2);
  let v = parseFloat(menuInputs.speed);

  if (isNaN(m1) || m1 <= 0 || m1 > 100) m1 = 2;
  if (isNaN(m2) || m2 <= 0 || m2 > 100) m2 = 4;
  if (isNaN(v) || v <= 0 || v > 20) v = 2;

  let b1 = new Ball(
    window.innerWidth / 2 - 200,
    height / 2,
    m1 * 5,
    m1,
    0,
    0,
    color(255, 100, 100)
  );
  let b2 = new Ball(
    window.innerWidth / 2 + 200,
    height / 2,
    m2 * 5,
    m2,
    -v,
    0,
    color(100, 100, 255)
  );
  balls.push(b1, b2);
}

function handle1DCollision() {
  let [a, b] = balls;
  let dx = b.x - a.x;
  let minDist = a.r + b.r;

  if (abs(dx) < minDist && dx > 0) {
    let v1 =
      ((a.m - b.m) / (a.m + b.m)) * a.vx + ((2 * b.m) / (a.m + b.m)) * b.vx;
    let v2 =
      ((b.m - a.m) / (a.m + b.m)) * b.vx + ((2 * a.m) / (a.m + b.m)) * a.vx;
    a.vx = v1;
    b.vx = v2;

    let overlap = minDist - abs(dx);
    a.x -= overlap / 2;
    b.x += overlap / 2;
  }
}

function setup2D() {
  balls = [];
  let count = parseInt(menuInputs.ballCount);
  if (isNaN(count) || count < 1 || count > 50) count = 5;

  for (let i = 0; i < count; i++) {
    let r = random(20, 40);
    let x = random(r, width - r);
    let y = random(r, height - r);
    let m = r / 10;
    let vx = random(-2, 2);
    let vy = random(-2, 2);
    let col = color(random(100, 255), random(100, 255), random(100, 255));
    balls.push(new Ball(x, y, r, m, vx, vy, col));
  }
}

function handle2DCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let a = balls[i];
      let b = balls[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = sqrt(dx * dx + dy * dy);
      let minDist = a.r + b.r;

      if (dist < minDist) {
        let nx = dx / dist;
        let ny = dy / dist;

        let dvx = a.vx - b.vx;
        let dvy = a.vy - b.vy;
        let dot = dvx * nx + dvy * ny;

        let impulse = (2 * dot) / (a.m + b.m);

        a.vx -= impulse * b.m * nx;
        a.vy -= impulse * b.m * ny;
        b.vx += impulse * a.m * nx;
        b.vy += impulse * a.m * ny;

        let overlap = minDist - dist;
        a.x -= (overlap / 2) * nx;
        a.y -= (overlap / 2) * ny;
        b.x += (overlap / 2) * nx;
        b.y += (overlap / 2) * ny;
      }
    }
  }
}
