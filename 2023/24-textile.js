let gui;
let params = {
  threadCount: 10,

  red: false,
  lightGreen: false,
  purple: false,
  fall: true,
  winter: true,
  yellow: false,
  maroon: false,
};

const THREAD_RADIUS = 4;
const COLOR_GROUPS = {
  red: [[0, 100, 50]],
  lightGreen: [[140, 100, 50]],
  purple: [[290, 100, 30]],
  fall: [
    [0, 0, 50],
    [0, 100, 50],
    [60, 100, 50],
    [30, 90, 40],
  ],
  winter: [
    [180, 90, 40],
    [244, 90, 40],
    [244, 85, 20],
    [244, 85, 85],
  ],
  yellow: [[55, 80, 55]],
  maroon: [[340, 55, 35]],
};

function setup() {
  createCanvas(400, 400);
  colorMode(HSL, 360, 100, 100);

  gui = createGuiPanel("params");
  gui.addObject(params);
  gui.setPosition(420, 130);
}

function draw() {
  noLoop();

  background(255);

  let xBundleCount = width / (params.threadCount * THREAD_RADIUS);
  let yBundleCount = height / (params.threadCount * THREAD_RADIUS);

  let colorGroups = [];
  for (let [name, group] of Object.entries(COLOR_GROUPS)) {
    if (params[name] === true) {
      colorGroups.push(group);
    }
  }
  if (colorGroups.length == 0) {
    return;
  }

  for (let y = 0; y <= yBundleCount; y++) {
    bundle(
      random(colorGroups),
      0,
      y * params.threadCount * THREAD_RADIUS,
      400 + THREAD_RADIUS,
      y * params.threadCount * THREAD_RADIUS,
      params.threadCount,
      false
    );
  }

  for (let x = 0; x <= xBundleCount; x++) {
    let colorGroup = random(colorGroups);
    for (let y = 0; y <= yBundleCount; y++) {
      if ((x + y) % 2 == 0) {
        bundle(
          colorGroup,
          x * params.threadCount * THREAD_RADIUS,
          y * params.threadCount * THREAD_RADIUS,
          x * params.threadCount * THREAD_RADIUS,
          (y + 1) * params.threadCount * THREAD_RADIUS + THREAD_RADIUS,
          params.threadCount,
          true
        );
      }
    }
  }

  noLoop();
}

function bundle(colors, x1, y1, x2, y2, n, is_x) {
  for (let delta = 0; delta < n; delta++) {
    thread(
      colors,
      x1 + (is_x ? delta * THREAD_RADIUS : 0),
      y1 + (!is_x ? delta * THREAD_RADIUS : 0),
      x2 + (is_x ? delta * THREAD_RADIUS : 0),
      y2 + (!is_x ? delta * THREAD_RADIUS : 0)
    );
  }
}

function thread(colors, x1, y1, x2, y2) {
  noFill();

  let color = random(colors);
  let src = createVector(x1, y1);
  let dst = createVector(x2, y2);

  let offset = p5.Vector.sub(dst, src);
  offset.normalize();
  offset.mult(2);

  let a = TWO_PI / 8;
  for (
    let p = src.copy(), i = 0;
    p5.Vector.sub(dst, p).mag() > THREAD_RADIUS;
    p.add(offset), i++
  ) {
    let [h, s, l] = color;
    h = parseInt(h + random(10)) % 360;

    strokeWeight(0.1);
    stroke("black");
    fill([h, s, l]);
    circle(
      p.x + random(THREAD_RADIUS / 4) - THREAD_RADIUS / 8,
      p.y + random(THREAD_RADIUS / 4) - THREAD_RADIUS / 8,
      THREAD_RADIUS
    );
  }
}

function stack(thunk) {
  push();
  thunk();
  pop();
}
