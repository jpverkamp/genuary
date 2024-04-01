let original;

function index(x, y, w, h, c) {
  return constrain(
    parseInt((y * w + x) * 4 + c),
    0,
    w * h * 4
  );
}

function preload() {
  console.log('Loading...');
  original = loadImage("https://picsum.photos/400");
  console.log("done");
}

function setup() {
  createCanvas(400, 400);
  frameRate(2);
  image(original, 0, 0);
}

function draw() {
  original.loadPixels();
  
  let maxOffset = 40;
  
  let x, y, w, h, offset;
  
  while (true) {
    let x1 = random(maxOffset, width - maxOffset);
    let x2 = random(maxOffset, width - maxOffset);
    let y1 = random(0, height);
    let y2 = random(0, height);

    x = min(x1, x2);
    w = max(x1, x2) - x;

    y = min(y1, y2);
    h = max(y1, y2) - y;

    offset = random(10, maxOffset);
  
    if (offset < w / 4) break;
  }
  
  let slice = original.get(x, y, w, h);
  
  // Remove red
  blendMode(DIFFERENCE);
  noStroke(); 
  fill(255, 0, 0, 255);
  rect(x - offset, y, w, h);
  
  // Add offset red
  blendMode(ADD);
  tint(255, 0, 0, 255);
  image(slice, x - offset, y);
  
  // Remove blue
  blendMode(DIFFERENCE);
  noStroke(); 
  fill(0, 0, 255, 255);
  rect(x + offset, y, w, h);
  
  // Add offset blue
  blendMode(ADD);
  tint(0, 0, 255, 255);
  image(slice, x + offset, y);
}
