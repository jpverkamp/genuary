let gui;
let params = {
  branches: 3,
  branchesMin: 1,
  branchesMax: 10,
  multiplier: 0.8,
  multiplierMin: 0.05,
  multiplierMax: 0.95,
  multiplierStep: 0.05,

  sway: true,
  swayPerLevel: true,
  swayPerBranch: true,

  maxSplits: 4,
  maxSplitsMin: 1,
  maxSplitsMax: 10,
  minLength: 10,
  minLengthMin: 1,
  minLengthMax: 100,

  maxSplit: 3.1415 / 4,
  maxSplitMin: 0,
  maxSplitMax: 3.1415,
  maxSplitStep: 0.01,
};

function setup() {
  createCanvas(400, 400);

  gui = createGuiPanel("params");
  gui.addObject(params);
  gui.setPosition(420, 130);
}

function draw() {
  background(255);

  function step(length, count, index) {
    let left = params.maxSplit;
    let right = params.maxSplit;

    if (params.sway) {
      let a = frameCount / 100.0;
      let b = params.swayPerLevel ? count : 0;
      let c = params.swayPerBranch ? index : 0;

      left = noise(a, 0, b + c) * params.maxSplit;
      right = noise(a, 1, b + c) * params.maxSplit;
    }

    let each = (left + right) / (params.branches - 1);

    push();

    stroke(0);
    fill(0);
    line(0, 0, 0, length);

    translate(0, length);

    if (count <= params.maxSplits && length > params.minLength) {
      // Branches if we have more splits and enough length left
      rotate(-left);
      step(length * params.multiplier, count + 1, 0);

      for (let i = 0; i < params.branches - 1; i++) {
        rotate(each);
        step(length * params.multiplier, count + 1, i + 1);
      }
    } else {
      // Otherwise, leaves
      fill(0, 255, 0);
      circle(0, 0, 20);
    }

    pop();
  }

  translate(200, 400);
  rotate(PI);
  step(100, 1);
}
