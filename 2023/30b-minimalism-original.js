let gui;
let params = {
  cycle: 10,
  refresh: 10,
  offset: 20,
  radius: 100,
};

let x, y;

function setup() {
  createCanvas(400, 400);

  x = random(200) + 100;
  y = random(200) + 100;

  gui = createGuiPanel("params");
  gui.addObject(params);
  gui.setPosition(420, 0);
}

function draw() {
  stroke("black");
  noFill();

  if (frameCount % (params.cycle * params.refresh) == 0) {
    background("white");
  }

  if (frameCount % params.cycle == 0) {
    x = random(200) + 100;
    y = random(200) + 100;
  }

  circle(
    x + params.offset * cos(frameCount / params.cycle),
    y + params.offset * sin(frameCount / params.cycle),
    params.radius
  );
}
