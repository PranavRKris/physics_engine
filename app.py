from flask import Flask, render_template, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/gravity')
def gravity():
    return render_template('gravity.html')


@app.route('/collision')
def collision():
    return render_template('collision.html')


@app.route('/projectile')
def projectile():
    return render_template('projectile.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
