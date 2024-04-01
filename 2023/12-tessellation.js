const SIZE = 40;

let gui;
let params = {
  scale: 1.0,
  scaleMin: 0.25,
  scaleMax: 3.0,
  scaleStep: 0.01,
  drawBorders: true,
  applyRotation: true,
  fastFlux: true,
  varyRotations: true,
};

let g;
let buffer;
let bufferMask;
let lastRedrawBuffer;

function setup() {
  createCanvas(400, 400);
  g = createGraphics(width, height);

  buffer = createGraphics(2 * SIZE, 2 * SIZE);
  for (let i = 0; i < 100; i++) {
    buffer.fill(255 * random(), 255 * random(), 255 * random(), 255 * random());
    buffer.rect(
      random(4 * SIZE) - 2 * SIZE,
      random(4 * SIZE) - 2 * SIZE,
      random(2 * SIZE),
      random(2 * SIZE)
    );
  }
  redrawBuffer();

  bufferMask = createGraphics(2 * SIZE, 2 * SIZE);
  bufferMask.push();
  {
    bufferMask.translate(SIZE, SIZE);
    bufferMask.scale(params.scale);
    bufferMask.stroke("black");
    bufferMask.fill("black");
    ngon(bufferMask, 6, SIZE);
  }
  bufferMask.pop();

  gui = createGuiPanel("params");
  gui.addObject(params);
  gui.setPosition(420, 130);
}

function draw() {
  g.background(255);

  if (params.fastFlux) {
    drawOneToBuffer();
  } else {
    if (millis() - lastRedrawBuffer > 1000) {
      redrawBuffer();
    }
  }

  let masked = buffer.get();
  masked.mask(bufferMask);

  g.push();
  {
    g.stroke("black");
    g.fill("green");

    g.translate(200, 200);
    g.scale(params.scale);

    g.stroke("black");
    g.noFill();

    if (params.drawBorders) {
      g.stroke("black");
      g.strokeWeight(2);
      ngon(g, 6, SIZE);
    }

    g.push();
    {
      g.translate(-SIZE, -SIZE);
      g.image(masked, 0, 0);
    }
    g.pop();

    for (let xd = -10; xd < 10; xd++) {
      for (let yd = -50; yd < 50; yd++) {
        if (xd == 0 && yd == 0) continue;

        g.push();
        {
          let rowOffset = abs(yd) % 2 == 1 ? 1.5 * SIZE : 0;

          // Major thanks to:
          // https://www.redblobgames.com/grids/hexagons/
          g.translate(rowOffset + 3.0 * xd * SIZE, (sqrt(3) / 2) * yd * SIZE);

          if (params.applyRotation) {
            let n = noise(
              xd,
              yd,
              params.varyRotations ? frameCount / 500.0 : 0
            );
            g.rotate((TWO_PI / 6.0) * parseInt(n * 6));
          }

          g.push();
          {
            g.translate(-SIZE, -SIZE);
            g.image(masked, 0, 0);
          }
          g.pop();

          if (params.drawBorders) {
            g.stroke("black");
            g.strokeWeight(2);
            ngon(g, 6, SIZE);
          }
        }
        g.pop();
      }
    }
  }
  g.pop();

  image(g, 0, 0);
}

function ngon(g, n, size) {
  g.beginShape();
  for (let i = 0; i < n; i++) {
    let x = size * cos((TWO_PI * i) / n);
    let y = size * sin((TWO_PI * i) / n);
    g.vertex(x, y);
  }
  g.endShape(CLOSE);
}

function redrawBuffer() {
  buffer.background(255);
  for (let i = 0; i < 100; i++) {
    drawOneToBuffer();
  }
  lastRedrawBuffer = millis();
}

function drawOneToBuffer() {
  buffer.fill(255 * random(), 255 * random(), 255 * random(), 255 * random());
  buffer.rect(
    random(4 * SIZE) - 2 * SIZE,
    random(4 * SIZE) - 2 * SIZE,
    random(2 * SIZE),
    random(2 * SIZE)
  );
}
