let gui;
let params = {
  margin: 30,
  midpoint: 150,

  neckOffset: 10,
  neckLength: 50,
  neckWidth: 15,

  headWidth: 50,
  headHeight: 30,

  bodyThickness: 50,

  backLegWidth: 50,
  backLegLength: 100,
  backLegSpread: 20,

  frontLegWidth: 25,
  frontLegLength: 140,
  frontLegSpread: 15,
};

function setup() {
  createCanvas(400, 400);
  background("white");
  frameRate(5);

  gui = createGuiPanel("params");
  gui.addObject(params);
  gui.setPosition(420, 130);
}

function draw() {
  if (frameCount % 10 == 0) {
    background("white");
  }

  stroke("purple");
  noFill();

  let margin = 30;
  let midpoint = 200;

  let locals = { ...params };
  for (let key in locals) {
    locals[key] *= 1 + random() / 10;
  }

  push();
  translate(locals.margin, locals.midpoint);
  relativePolygon([
    // Neck up
    [locals.neckOffset, 0],
    [-locals.neckOffset, -locals.neckLength],
    // Head
    [locals.neckWidth / 2 - locals.headWidth / 2, 0],
    [0, -locals.headHeight],
    [locals.headWidth, 0],
    [0, locals.headHeight],
    [-locals.headWidth / 2 + locals.neckWidth / 2, 0],
    // Neck down
    [locals.neckOffset, locals.neckLength],
    // Across back
    [
      -(
        // Rest neck
        (locals.neckOffset + locals.neckWidth)
      ) + // Rest of back
        (width - 2 * locals.margin),
      0,
    ],
    // 4th leg
    [0, locals.bodyThickness + locals.backLegLength],
    [-locals.backLegWidth, 0],
    [0, -locals.backLegLength],
    // 3/4 split
    [-locals.backLegSpread, 0],
    // 3rd leg
    [0, locals.backLegLength],
    [-locals.backLegWidth, 0],
    [0, -locals.backLegLength],
    // Across belly
    [
      0 + // Go back to the butt
        (2 * locals.backLegWidth + locals.backLegSpread) - // Go to the front
        (width - 2 * locals.margin) + // Go back across front legs
        (2 * locals.frontLegWidth + locals.frontLegSpread),
      0,
    ],
    // 2nd leg
    [0, locals.frontLegLength],
    [-locals.frontLegWidth, 0],
    [0, -locals.frontLegLength],
    // 1/2 split
    [-locals.frontLegSpread, 0],
    // 1st leg
    [0, locals.frontLegLength],
    [-locals.frontLegWidth, 0],
    [0, -locals.frontLegLength],
  ]);
  pop();
}

function relativePolygon(offsets) {
  beginShape();
  vertex(0, 0);
  let x = 0,
    y = 0;
  for (let [xd, yd] of offsets) {
    x += xd;
    y += yd;
    vertex(x, y);
  }
  endShape(CLOSE);
}
