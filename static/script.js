let simulationData = [];
let frameIndex = 0;

function setup() {
    createCanvas(600, 400).parent('canvas-holder');
    frameRate(30);

    fetch('/simulate')
        .then(res => res.json())
        .then(data => {
            simulationData = data;
        });
}

function draw() {
    background(220);

    if (frameIndex < simulationData.length) {
        let frame = simulationData[frameIndex];
        for (let obj of frame.objects) {
            ellipse(obj.x, obj.y, 20, 20);
        }
        frameIndex++;
    }
}
