function setup() {
  createCanvas(400, 400);
  background(255);
  rectMode(CENTER);

  stroke(255);
  fill(0);
}

function draw() {
  translate(200, 200);
  
  rotate((frameCount % 360) * TWO_PI / 360.0);
  scale(cos(frameCount / 100.0));
  
  rect(0, 0, 200, 200);
}
