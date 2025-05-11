let isRunning = false;
let projectiles = [];
let slingAnchor;
let isDragging = false;
let dragStart = null;
let menuInputs = {
  gravity: "Earth",
  wind: "0",
};
let selectedInput = null;
let startBtnArea = { x: 100, y: 350, w: 100, h: 40 };
let gravityOptions = ["Earth", "Moon", "Mars"];
let gravityValues = {
  Earth: 0.5,
  Moon: 0.08,
  Mars: 0.2,
};
let showGravityDropdown = false;

function setup() {
  createCanvas(window.innerWidth, 600).parent("canvas-holder");
  slingAnchor = createVector(150, height - 20);
}

function draw() {
  background(30, 30, 30, 100); // Fading background for trail effect

  if (!isRunning) {
    drawMenu();
    return;
  }

  drawCatapult();
  drawGround();

  if (isDragging && dragStart) {
    drawTrajectoryPreview();
  }

  projectiles = projectiles.filter((p) => {
    let alive = p.update();
    p.display();
    return alive;
  });

  handleCollisions();
}

function drawGround() {
  fill(80);
  noStroke();
  rect(0, height - 20, width, 20);
}

function drawCatapult() {
  stroke(150);
  strokeWeight(8);
  line(slingAnchor.x - 15, slingAnchor.y, slingAnchor.x, slingAnchor.y - 60);
  line(slingAnchor.x + 15, slingAnchor.y, slingAnchor.x, slingAnchor.y - 60);
  strokeWeight(2);
  noStroke();
  fill(255, 100, 100);
  ellipse(slingAnchor.x, slingAnchor.y - 60, 20);
}

function drawTrajectoryPreview() {
  const force = p5.Vector.sub(dragStart, createVector(mouseX, mouseY)).mult(
    0.1
  );
  let tempX = slingAnchor.x;
  let tempY = slingAnchor.y - 60;
  let vx = force.x;
  let vy = force.y;
  let g = gravityValues[menuInputs.gravity] || 0.5;
  let wind = parseFloat(menuInputs.wind) || 0;
  stroke(255);
  noFill();
  beginShape();
  for (let t = 0; t < 100; t++) {
    vertex(tempX, tempY);
    tempX += vx;
    tempY += vy;
    vy += g;
    vx += wind * 0.01;
  }
  endShape();
}

function mousePressed() {
  if (!isRunning) {
    selectedInput = null;

    if (mouseInside(100, 210, 120, 30)) {
      showGravityDropdown = !showGravityDropdown;
    } else if (showGravityDropdown) {
      for (let i = 0; i < gravityOptions.length; i++) {
        if (mouseInside(100, 240 + i * 30, 120, 30)) {
          menuInputs.gravity = gravityOptions[i];
          showGravityDropdown = false;
        }
      }
    } else {
      showGravityDropdown = false;
    }

    if (mouseInside(100, 270, 120, 30)) {
      selectedInput = "wind";
    }

    if (
      mouseInside(
        startBtnArea.x,
        startBtnArea.y,
        startBtnArea.w,
        startBtnArea.h
      )
    ) {
      isRunning = true;
      resetProjectile();
    }
    return;
  }

  isDragging = true;
  dragStart = createVector(mouseX, mouseY);
}

function mouseReleased() {
  if (isRunning && isDragging && dragStart) {
    let force = p5.Vector.sub(dragStart, createVector(mouseX, mouseY)).mult(
      0.1
    );
    if (projectiles.length >= 20) {
      projectiles.shift(); // Remove oldest
    }
    projectiles.push(
      new Projectile(slingAnchor.x, slingAnchor.y - 60, force.x, force.y)
    );
    isDragging = false;
    dragStart = null;
  }
}

function handleCollisions() {
  for (let i = 0; i < projectiles.length; i++) {
    for (let j = i + 1; j < projectiles.length; j++) {
      let a = projectiles[i];
      let b = projectiles[j];
      let d = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
      if (d < a.r + b.r) {
        let angle = atan2(b.pos.y - a.pos.y, b.pos.x - a.pos.x);
        let overlap = a.r + b.r - d;
        let separation = p5.Vector.fromAngle(angle).mult(overlap / 2);
        a.pos.sub(separation);
        b.pos.add(separation);

        let normal = p5.Vector.sub(b.pos, a.pos).normalize();
        let relVel = p5.Vector.sub(b.vel, a.vel);
        let speed = relVel.dot(normal);
        if (speed < 0) continue;
        let impulse = normal.copy().mult(speed * 0.5);
        a.vel.add(impulse);
        b.vel.sub(impulse);
      }
    }
  }
}

function keyPressed() {
  if (selectedInput && key >= "0" && key <= "9") {
    menuInputs[selectedInput] += key;
  } else if (selectedInput && keyCode === BACKSPACE) {
    menuInputs[selectedInput] = menuInputs[selectedInput].slice(0, -1);
  } else if ((selectedInput && keyCode === ESCAPE) || keyCode === ENTER) {
    selectedInput = null;
  }
}

function drawMenu() {
  textSize(20);
  fill(255);
  text("Projectile Simulation", 100, 60);
  drawInputField("Planet:", menuInputs.gravity, 100, 180, "gravity");

  let windY = showGravityDropdown ? 180 + 80 + gravityOptions.length * 30 : 240;
  drawInputField("Wind Speed:", menuInputs.wind, 100, windY, "wind");

  startBtnArea.y = windY + 70;
  drawStartButton();
}

function drawInputField(label, value, x, y, key) {
  textSize(14);
  fill(255);
  textAlign(LEFT, TOP);
  text(label, x, y);
  fill(255);
  rect(x, y + 20, 120, 30, 5);
  fill(0);
  textAlign(LEFT, CENTER);
  text(value, x + 5, y + 35);
  if (key === "gravity" && showGravityDropdown) {
    for (let i = 0; i < gravityOptions.length; i++) {
      let optionY = y + 50 + i * 30;
      fill(255);
      rect(x, optionY, 120, 30);
      fill(0);
      textAlign(LEFT, CENTER);
      text(gravityOptions[i], x + 5, optionY + 15);
    }
  }
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

function resetProjectile() {
  projectiles = [];
  isDragging = false;
  dragStart = null;
}

class Projectile {
  constructor(x, y, vx, vy) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.r = 12;
    this.age = 0;
  }

  update() {
    let g = gravityValues[menuInputs.gravity] || 0.5;
    let wind = parseFloat(menuInputs.wind) || 0;
    this.vel.y += g;
    this.vel.x += wind * 0.01;
    this.pos.add(this.vel);
    this.age++;

    if (this.pos.y + this.r > height - 20) {
      this.pos.y = height - 20 - this.r;
      this.vel.y *= -0.7;
    }

    if (this.pos.y - this.r < 0) {
      this.pos.y = this.r;
      this.vel.y *= -0.7;
    }

    if (this.pos.x - this.r < 0) {
      this.pos.x = this.r;
      this.vel.x *= -0.7;
    }

    if (this.pos.x + this.r > width) {
      this.pos.x = width - this.r;
      this.vel.x *= -0.7;
    }

    return this.age < 200;
  }

  display() {
    let alpha = map(this.age, 0, 200, 255, 50);
    alpha = constrain(alpha, 50, 255);

    fill(255, 150, 0, alpha);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
