function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(0);

    // Border
    rectMode(CENTER);
    for (let i = 0; i < 24; i++) {
        let a = i * TWO_PI / 24;
        let x = width / 2 + width / 4 * cos(a);
        let y = height / 2 + width / 4 * sin(a);

        fill(
          255 * noise(frameCount / 100.0, i / 24.0, 1),
          255 * noise(frameCount / 100.0, i / 24.0, 2),
          255 * noise(frameCount / 100.0, i / 24.0, 3)
        );
        rect(x, y, 50, 50);
    } 

    push();
    {
      rectMode(CORNER);
      translate(200, 200);
      fill(255);

      // Hour hand
      push();
      {
        rotate(PI + ((TWO_PI * hour()) % 12) / 12);
        rect(0, 0, 4, 40);
      }
      pop();

      // Minute hand
      push();
      {
        rotate(PI + (TWO_PI * minute()) / 60);
        rect(0, 0, 3, 60);
      }
      pop();

      // Second hand
      push();
      {
        rotate(PI + (TWO_PI * second()) / 60);
        rect(0, 0, 2, 80);
      }
      pop();
    }
    pop();
}
