# physics_engine.py

def simulate_gravity():
    objects = [
        {"x": 100, "y": 50, "vx": 0, "vy": 0, "mass": 1},
        {"x": 200, "y": 100, "vx": 0, "vy": 0, "mass": 2}
    ]
    g = 9.8
    dt = 0.1
    frames = []

    for t in range(100):
        frame = {"time": t * dt, "objects": []}
        for obj in objects:
            obj["vy"] += g * dt
            obj["y"] += obj["vy"] * dt
            obj["x"] += obj["vx"] * dt
            frame["objects"].append({"x": obj["x"], "y": obj["y"]})
        frames.append(frame)

    return frames
