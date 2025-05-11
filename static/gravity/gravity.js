let bgImage;
let spacecraft = [];
let planet;
let planetImg;
let planetMass = 100;
let gravityFactor = 1;
let shipMass = 1;
let selectedPlanet = "earth";
let dragStart = null;
let isDragging = false;

const PLANET_DATA = {
  earth: { mass: 100, gravity: 1, img: "earth.png" },
  mars: { mass: 10.7, gravity: 0.38, img: "mars.png" },
  jupiter: { mass: 500, gravity: 2.53, img: "jupiter.png" },
};

function preload() {
  bgImage = loadImage("/static/assets/background.jpg");
  loadPlanetImage(selectedPlanet);
}

function setup() {
  createCanvas(800, 600).parent("canvas-holder");
  frameRate(60);
  planet = { x: width / 2, y: height / 2 };
}

function draw() {
  background(bgImage || 220);

  // Read slider value from HTML element
  let sliderElem = document.getElementById("mass-slider");
  if (sliderElem) shipMass = sliderElem.value;

  image(planetImg, planet.x - 50, planet.y - 50, 100, 100);

  for (let obj of spacecraft) {
    obj.update();
    obj.draw();
  }

  if (isDragging && dragStart !== null) {
    stroke(255);
    line(dragStart.x, dragStart.y, mouseX, mouseY);
    noStroke();
    fill(255, 0, 0);
    ellipse(dragStart.x, dragStart.y, 10, 10); // show base of launch
  }

  spacecraft = spacecraft.filter(
    (s) => !s.offScreen() && !s.collidesWith(planet)
  );
}

function mousePressed() {
  if (mouseY > 50) {
    if (dragStart === null) {
      // First click: store drag start position
      dragStart = createVector(mouseX, mouseY);
      isDragging = true;
    } else {
      // Second click: compute velocity
      let dragEnd = createVector(mouseX, mouseY);
      let velocity = p5.Vector.sub(dragEnd, dragStart).div(100); // Scale velocity
      spacecraft.push(
        new Spacecraft(dragStart.x, dragStart.y, shipMass, velocity)
      );
      dragStart = null;
      isDragging = false;
    }
  }
}

function changePlanet(name) {
  selectedPlanet = name;
  const data = PLANET_DATA[name];
  planetMass = data.mass;
  gravityFactor = data.gravity;
  loadPlanetImage(name);
}

function loadPlanetImage(name) {
  planetImg = loadImage("/static/assets/planets/" + PLANET_DATA[name].img);
}

class Spacecraft {
  constructor(x, y, mass, velocityVec) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.vx = velocityVec.x;
    this.vy = velocityVec.y;
  }

  update() {
    let dx = planet.x - this.x;
    let dy = planet.y - this.y;
    let distSq = dx * dx + dy * dy;
    let force = (5 * this.mass * planetMass) / distSq;
    let angle = atan2(dy, dx);

    let ax = (force * cos(angle)) / this.mass;
    let ay = (force * sin(angle)) / this.mass;

    this.vx += ax;
    this.vy += ay;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, 10, 10);
  }

  offScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }

  collidesWith(p) {
    let d = dist(this.x, this.y, p.x, p.y);
    return d < 50; // radius of planet
  }
}
