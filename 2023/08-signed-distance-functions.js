
function setup() {
  createCanvas(400, 400);
  background(0);
}

function draw() {
  // Draw 1000 dots per frame
  for (let k = 0; k < 1000; k++) {
    // Choose a random point [-1, 1]
    let ox = 2 * random() - 1;
    let oy = 2 * random() - 1;
    
    let x = ox;
    let y = oy;
    
    x += noise(frameCount / 100.0, 0) / 10.0 - 0.05;
    y += noise(frameCount / 100.0, 1) / 10.0 - 0.05;
    
    // Calculate the SDF at that point
    let d = sdfUnion(
      // S top
      sdfSubtract(
        sdfCircle([x, y], [-0.5, -0.35], 0.4),
        sdfCircle([x, y], [-0.5, -0.35], 0.3),
        sdfBox([x, y], [0, 0], [0.5, 0.5])
      ),
      
      // S bottom
      sdfSubtract(
        sdfCircle([x, y], [-0.5, 0.35], 0.4),
        sdfCircle([x, y], [-0.5, 0.35], 0.3),
        sdfBox([x, y], [-1, 0], [0.5, 0.5])
      ),
      
      // D round
      sdfSubtract(
        sdfCircle([x, y], [-0.2, 0], 0.5),
        sdfCircle([x, y], [-0.2, 0], 0.4),
        sdfBox([x, y], [-0.7, 0], [0.5, 1])
      ),
      
      // D line
      sdfBox([x, y], [-0.2, 0], [0.05, 0.5]),
      
      // F vertical
      sdfBox([x, y], [0.3, 0], [0.05, 0.75]),
      
      // F top
      sdfBox([x, y], [0.55, -0.7], [0.3, 0.05]),
      
      // F middle
      sdfBox([x, y], [0.45, -0.2], [0.2, 0.05])
    );
    
    // Assign a color based on if we're inside/outside/at the line
    let c = '#000';
    if (d < -0.01) c = '#c6c';
    if (d >  0.01) c = '#0f4';

    // Draw a dot, recenter on the center of the screen
    noStroke();
    fill(c);
    circle(
      (1.0 + ox) * width / 2,
      (1.0 + oy) * height / 2,
    2);
  }
}

/* HELPER FUNCTIONS */

function sdfDistance(x, y) {
  return (x * x + y * y) ** 0.5;
}

function sdfEdge(a, b) { 
  return a > 0 && b > 0 ? sdfDistance(a, b) : a > b ? a : b;
}

/* SHAPES */

// Draw a circle at the given point, offset, and radius
function sdfCircle([x,y], [cx, cy], r) {
  x -= cx;
  y -= cy;
  return sdfDistance(x, y) - r;
}

// Draw a box at the given point, offset, and width/height
function sdfBox([x,y], [cx, cy], [w, h]) {
  x -= cx;
  y -= cy;
  return sdfEdge(abs(x) - w, abs(y) - h);  
}

/* COMBINATORS */

function sdfUnion() {
  return min(...arguments);
}

function sdfSubtract() {
  return max(...[...arguments].map((v, i) => i == 0 ? v : -1 * v));
}

function sdfIntersect() {
  return max(...arguments);
}
