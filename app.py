from flask import Flask, render_template, jsonify
from physics_engine import simulate_gravity

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/simulate")
def simulate():
    data = simulate_gravity()  # list of position data
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
