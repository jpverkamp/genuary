function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  push();
  {
    translate(200, 200);
    rotate(TWO_PI / random(360));
    
    // Set up a modulo every N seconds (the div in blockCount)
    let secondCount = parseInt(frameCount / 60);
    let blockCount = parseInt(secondCount / 5);
    
    // Every other block, swap blend mode
    blendMode({
      0: DIFFERENCE,
      1: ADD
    }[blockCount % 2]);
    
    // Each block out (or each two) move down in scale
    let scaleScale = {
      0: 1.0,
      1: 1.0,
      2: 0.8,
      3: 0.8,
      4: 0.6,
      5: 0.6,
      6: 0.4,
      7: 0.4,
    }[blockCount % 8];
    
    scale(scaleScale * (random() - 0.5));

    fill(
      random(255),
      random(255),
      random(255),
    )
    rect(0, 0, 400, 400);
  }
  pop();
}
