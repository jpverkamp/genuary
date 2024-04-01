function frame_cycle(C) {
  return cos(map(frameCount % C, 0, C, -1.0, 1.0));
}

function setup() {
  createCanvas(400, 400);
  colorMode(HSL);
}

function draw() {
  fill(360 * frame_cycle(90), 100, 50, 1);

  push();
  translate(width / 2, height / 2);
  rotate(360 * frame_cycle(180));
  scale(frame_cycle(15));

  rect(0, 0, width / 4, height / 4);
  pop();
}
