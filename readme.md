# Physics Engine Simulators

A collection of interactive physics simulations built with Flask and p5.js, visualizing core mechanics such as gravity, collisions, and projectile motion. Each simulator includes an educational section explaining the underlying physics and code.

## 🚀 Features

- **Gravity Simulator**: Launch spacecraft around planets with realistic Newtonian gravity. Adjust spacecraft mass and switch between Earth, Mars, and Jupiter.
- **Collision Simulator**: Explore 1D and 2D elastic collisions. Set masses, velocities, and number of balls to see conservation of momentum and energy in action.
- **Projectile Simulator**: Fire projectiles with slingshot mechanics. Adjust gravity (by planet) and wind, and observe bouncing and 2D elastic collisions.

## 🖥️ Demo

Each simulator is accessible from the main menu:

- [Gravity Simulator](http://localhost:5000/gravity)
- [Collision Simulator](http://localhost:5000/collision)
- [Projectile Simulator](http://localhost:5000/projectile)

## 📂 Project Structure

```
.
├── app.py
├── requirements.txt
├── dockerfile
├── static/
│   ├── index.css
│   ├── gravity/
│   │   ├── gravity.js
│   │   └── gravity.css
│   ├── collision/
│   │   ├── collision.js
│   │   └── collision.css
│   └── projectile/
│       ├── projectile.js
│       └── projectile.css
├── templates/
│   ├── index.html
│   ├── gravity.html
│   ├── collision.html
│   └── projectile.html
└── static/assets/
    ├── background.jpg
    └── planets/
```

## 🧑‍💻 Getting Started

### Prerequisites

- Python 3.10+ (or use Docker)
- [pip](https://pip.pypa.io/en/stable/)

### Installation

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd physics_engine
   ```

2. **Install dependencies:**

   ```sh
   pip install -r requirements.txt
   ```

3. **Run the app:**
   ```sh
   python app.py
   ```
   Visit [http://localhost:5000](http://localhost:5000) in your browser.

### Using Docker

Build and run the app in a container:

```sh
docker build -t physics-engine .
docker run -p 5000:5000 physics-engine
```

## 📝 Simulators Overview

### Gravity Simulator

- Drag and release to launch a spacecraft.
- Adjust mass with the slider.
- Switch planets to see different gravity and mass effects.
- Physics: Newtonian gravity, force direction, Euler integration.

### Collision Simulator

- 1D: Set masses and speed, observe elastic collision equations.
- 2D: Set number of balls, watch random collisions and momentum transfer.
- Physics: Conservation of momentum and energy, collision impulse.

### Projectile Simulator

- Pull and release to launch projectiles.
- Adjust gravity (Earth, Moon, Mars) and wind.
- Projectiles bounce and collide elastically.
- Physics: Kinematics, wind as acceleration, 2D collision resolution.

## 📚 Learn the Physics

Each simulator page includes a "Physics Behind" section, explaining the formulas and code logic used. Great for students and educators!

## 🗒️ TODO

See [todo.txt](todo.txt) for planned features:

- Pendulum, spring-mass, wave simulation, electric fields, rigid body physics, N-body gravity, and more.

## 🤝 Contributing

Pull requests and suggestions are welcome! Please open an issue to discuss changes.

## 📄 License

MIT License

---

**Created with Flask & p5.js for interactive physics learning.**
