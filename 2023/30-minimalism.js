let gui;
let params = {
  lineWidth: 10,
  minWidth: 50,
  maxWidth: 100,
  maxWidthMax: 400,
  minHeight: 50,
  maxHeight: 100,
  maxHeightMax: 400,
  colorChance: 0.1,
  colorChanceMin: 0,
  colorChanceMax: 1,
  colorChanceStep: 0.01,
};

let box;
let colors = ["red", "blue", "yellow"];

function setup() {
  createCanvas(400, 400);

  box = {
    x: -params.lineWidth,
    y: -params.lineWidth,
    width: random(params.minWidth, params.maxWidth),
    height: random(params.minHeight, params.maxHeight),
  };

  gui = createGuiPanel("params");
  gui.addObject(params);
  gui.setPosition(420, 130);
}

function draw() {
  strokeWeight(params.lineWidth);
  stroke("black");

  if (random() < params.colorChance) {
    fill(random(colors));
  } else {
    fill("white");
  }

  rect(box.x, box.y, box.width, box.height);

  box.y += box.height;
  box.height = random(params.minHeight, params.maxHeight);

  if (box.y > height) {
    box.x += box.width;
    box.y = -params.lineWidth;
    box.width = random(params.minWidth, params.maxWidth);
    box.height = random(params.minHeight, params.maxHeight);
  }

  if (box.x > width) {
    noLoop();
  }
}
