let gui;
let params = {
  sunSize: 10,
  sunSpeed: 1,

  gravity: 0.1,
  gravityMin: 0,
  gravityMax: 2.0,
  gravityStep: 0.01,
  sepForce: 0.2,
  sepForceMin: 0,
  sepForceMax: 2.0,
  sepForceStep: 0.01,
  friction: 0.1,
  frictionMin: 0,
  frictionMax: 1.0,
  frictionStep: 0.01,

  ballCount: 10,
  ballSize: 10,

  rays: 100,
  raysMin: 0,
  raysMax: 1000,
  raysStep: 1,
};

let state;

function setup() {
  createCanvas(400, 400);

  state = {
    light: { p: createVector(200, 20) },
    balls: [],
  };

  gui = createGuiPanel("params");
  gui.addObject(params);
  gui.setPosition(420, 130);
}

function draw() {
  // Update
  if (params.sunSpeed > 0) {
    state.light.p.x =
      200 + 200 * cos((frameCount * 1) / (101 - params.sunSpeed));
  }

  while (state.balls.length < params.ballCount) {
    state.balls.push({
      id: crypto.randomUUID(),
      p: createVector(random(400), 20),
      v: createVector(random() - 0.5, random() - 0.5),
    });
  }
  while (state.balls.length > params.ballCount) {
    state.balls.shift();
  }

  for (let ball of state.balls) {
    // Gravity
    let forces = createVector(0, 0);
    forces.y += params.gravity;

    // Ball/ball collisions
    for (let other of state.balls) {
      if (ball.id == other.id) continue;

      let offset = p5.Vector.sub(other.p, ball.p);
      if (offset.mag() < 1.1 * params.ballSize) {
        let force = offset;
        offset.normalize();
        force.mult(-params.sepForce);
        forces.add(force);
      }
    }

    // Walls
    if (ball.p.x < params.ballSize || ball.p.x > width - params.ballSize) {
      ball.v.x *= -(1 - params.friction);
      ball.p.x = max(params.ballSize, min(ball.p.x, width - params.ballSize));
    }

    if (ball.p.y < params.ballSize || ball.p.y > height - params.ballSize) {
      ball.v.y *= -(1 - params.friction);
      ball.p.y = max(params.ballSize, min(ball.p.y, height - params.ballSize));
    }

    // Kinematics
    forces.mult(1.0 - params.friction);
    ball.v.add(forces);
    ball.p.add(ball.v);
  }

  // Draw
  background(0);

  // https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html
  stroke("yellow");
  noFill();
  for (let ray = 0; ray < params.rays; ray++) {
    let a = (TWO_PI * ray) / params.rays;
    let D = createVector(cos(a), sin(a));

    let min_t;

    for (let ball of state.balls) {
      let L = p5.Vector.sub(ball.p, state.light.p);
      let tca = p5.Vector.dot(L, D);
      if (tca < 0) continue;

      let d = sqrt(p5.Vector.dot(L, L) - tca * tca);
      if (d < 0) continue;

      let r = params.ballSize / 2;
      let thc = sqrt(r * r - d * d);

      let t0 = tca - thc;
      let t1 = tca + thc;

      if (!min_t || t0 < min_t) min_t = t0;
      if (!min_t || t1 < min_t) min_t = t1;
    }

    line(
      state.light.p.x,
      state.light.p.y,
      state.light.p.x + (min_t || 1000) * D.x,
      state.light.p.y + (min_t || 1000) * D.y
    );
  }

  stroke("black");
  fill("red");
  circle(state.light.p.x, state.light.p.y, params.sunSize);

  stroke("black");
  fill("white");
  for (let ball of state.balls) {
    circle(ball.p.x, ball.p.y, params.ballSize);
  }
}
