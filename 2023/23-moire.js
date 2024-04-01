let gui;
let params = {
  gravity: 0.1,
  gravityMin: 0,
  gravityMax: 2.0,
  gravityStep: 0.01,
  sepForce: 1.0,
  sepForceMin: 0,
  sepForceMax: 2.0,
  sepForceStep: 0.01,
  friction: 0,
  frictionMin: 0,
  frictionMax: 1.0,
  frictionStep: 0.01,

  ballCount: 2,
  ballCountMin: 1,
  ballCountMax: 10,
  ballSize: 10,
  blendMode: ["difference", "blend", "add", "lightest", "screen", "hard_light"],

  rays: 400,
  raysMin: 0,
  raysMax: 1000,
  raysStep: 1,
};

let state;

function setup() {
  createCanvas(400, 400);
  colorMode(HSL);

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
  while (state.balls.length < params.ballCount) {
    state.balls.push({
      id: crypto.randomUUID(),
      p: createVector(random(400), 20),
      v: createVector(random() - 0.5, random() - 0.5),
      c: random(255),
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
        let force = p5.Vector.normalize(offset);
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
  blendMode(DARKEST);
  background(0);
  blendMode(
    {
      blend: BLEND,
      add: ADD,
      darkest: DARKEST,
      lightest: LIGHTEST,
      difference: DIFFERENCE,
      screen: SCREEN,
      overlay: OVERLAY,
      hard_light: HARD_LIGHT,
      soft_light: SOFT_LIGHT,
      dodge: DODGE,
      burn: BURN,
    }[params.blendMode]
  );

  noFill();
  for (let ball of state.balls) {
    stroke([ball.c, 100, 50]);

    for (let ray = 0; ray < params.rays; ray++) {
      let a = (TWO_PI * ray) / params.rays;
      let v = createVector(cos(a), sin(a));

      line(ball.p.x, ball.p.y, ball.p.x + 1000 * v.x, ball.p.y + 1000 * v.y);
    }
  }

  blendMode(BLEND);
  stroke("black");
  for (let ball of state.balls) {
    fill([ball.c, 100, 50]);
    circle(ball.p.x, ball.p.y, params.ballSize);
  }
}
