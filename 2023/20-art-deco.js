let params = {
  starCount: 10,
  starPoints: 20,
  starInnerRadius: 2,
  starInnerRadiusFlux: 4,
  starOuterRadius: 16,
  starOuterRadiusFlux: 4,
  
}

const MAN_DANCING = '🕺';
const WOMAN_DANCING = '💃';


function setup() {
  createCanvas(400, 400);
  frameRate(1);
  
}

function draw() {
  background(0);
  
  translate(200, 200);

  withPush(() => {
    let r1 = params.starInnerRadius;
    let r2 = params.starOuterRadius;

    let r1dMax = params.starInnerRadiusFlux;
    let r2dMax = params.starOuterRadiusFlux;

    for (let i = 0; i < params.starCount / 2; i++) {
      let x0 = random(width / 2);
      let y = random(-height / 2, height / 2);

      for (let x of [-x0, x0]) {


        stroke("#EEBC1D");
        noFill();

        for (let j = 0; j < params.starPoints; j++) {
          let a = random(TWO_PI);

          let r1d = random(r1dMax);
          let r2d = random(r2dMax);

          let x1 = x + (r1 + r1d) * cos(a);
          let y1 = y + (r1 + r2d) * sin(a);

          let x2 = x + (r2 + r2d) * cos(a);
          let y2 = y + (r2 + r2d) * sin(a);

          line(x1, y1, x2, y2);
        }
      }
    }
  });

  withPush(() => {
    doArtDeco(drawRandomBuilding);    
  });
  
  withPush(() => {
    doArtDeco(drawTitleBackground);

    noStroke();
    fill("black");
    textFont("sans-serif");
    textAlign(CENTER);
    textSize(38);
    scale(0.5, 2);
    translate(0, 15);
    text("GENUARY 2023.20 ART DECO", 0, 0);
  }); 
}

function doArtDeco(thunk) {
  withPush(() => {
    noStroke();
    noFill();
    
    stroke("#EEBC1D");
    scale(1.1);
    thunk();
    scale(0.98, 0.95);
    thunk();
    scale(0.98, 0.95);
    noStroke();
    
    fill("black");
    thunk();
    fill("#EEBC1D");
    scale(0.98, 0.95);
    thunk();
    fill("black");
    scale(0.98, 0.95);
    thunk();
    fill("#EEBC1D");
    scale(0.98, 0.95);
    thunk();
  });
}

function drawRandomBuilding() {
  let h = 400;
  let w = 100;
  
  for (let level = 0; level < 3; level++) {
    rect(0, -h/4, w, h);
    rect(0, -h/4, -w, h);
    
    h *= 1.0 + random(0.2);
    w *= 1.0 - random(0.2);
  }
  
  circle(0, h, 50);
}

function drawTitleBackground() {
  rectMode(CENTER);
  
  rect(0, 0, 300, 100);
  rect(0, 0, 325, 50);
  
  withPush(() => {
    translate(0, -50);
    circle(0, 0, 50);
  });
  
  withPush(() => {
    translate(0, 50);
    withPush(() => {
      shearX(1);
      translate(-50, 0);
      rect(0, 0, 100, 50);
    });
    withPush(() => {
      shearX(-1);
      translate(50, 0);
      rect(0, 0, 100, 50);
    });
  })
}

function withPush(thunk) {
  push();
  thunk();
  pop();
}
