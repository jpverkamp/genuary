let canvas;

function clear() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      pixels[(x + y * width) * 4 + 3] = 0;
    }
  }
  updatePixels();
}

function randomPicture() {
  noLoop();

  loadImage("https://picsum.photos/400", (picture) => {
    clear();
    picture.loadPixels();

    loadPixels();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let i = (x + y * width) * 4;

        let gray =
          (picture.pixels[i] + picture.pixels[i + 1] + picture.pixels[i + 2]) /
          3;
        if (gray > 200) {
          continue;
        }

        pixels[i] = picture.pixels[i];
        pixels[i + 1] = picture.pixels[i + 1];
        pixels[i + 2] = picture.pixels[i + 2];
        pixels[i + 3] = 255;
      }
    }
    updatePixels();

    loop();
  });
}

function addSand() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (pixels[(x + y * width) * 4 + 3] != 0) {
        continue;
      }

      if (random() < 0.25) {
        let i = (x + y * width) * 4;
        pixels[i] = 255 * (x / width);
        pixels[i + 1] = 255 * (y / height);
        pixels[i + 2] = 0;
        pixels[i + 3] = 255;
      }
    }
  }
  updatePixels();
}

function flip() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height / 2; y++) {
      let i = (x + y * width) * 4;
      let j = (x + (height - y - 1) * width) * 4;

      let temp = pixels[i];
      pixels[i] = pixels[j];
      pixels[j] = temp;

      temp = pixels[i + 1];
      pixels[i + 1] = pixels[j + 1];
      pixels[j + 1] = temp;

      temp = pixels[i + 2];
      pixels[i + 2] = pixels[j + 2];
      pixels[j + 2] = temp;

      temp = pixels[i + 3];
      pixels[i + 3] = pixels[j + 3];
      pixels[j + 3] = temp;
    }
  }
  updatePixels();
}

function setup() {
  createCanvas(400, 400);
  pixelDensity(1);

  // noLoop();
  // text("loading...", 10, 10);
  // randomPicture();

  addSand();

  createButton("random image").mousePressed(randomPicture);
  createButton("add sand").mousePressed(addSand);
  createButton("flip").mousePressed(flip);
}

function draw() {
  loadPixels();
  let updates = 0;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      let i = (x + y * width) * 4;

      // Don't move transparent pixels
      if (pixels[i + 3] == 0) {
        continue;
      }

      // Get the RGB
      let r = pixels[i];
      let g = pixels[i + 1];
      let b = pixels[i + 2];

      // 'weight' is based on how black a pixel is
      let weight = Math.max(r, g, b) / 255;

      // Heavier pixels move more down and less side to side
      let dx = round(4 * randomGaussian(0, 4 * weight));
      let dy = Math.max(0, 1 + round(2 * randomGaussian(0, 1 - weight)));

      let x1 = Math.min(0, Math.max(width - 1, x + dx));
      let y1 = Math.min(0, Math.max(height - 1, y + dy));
      let j = (x + dx + (y + dy) * width) * 4;

      // Only move into transparent pixels
      if (pixels[j + 3] != 0) {
        continue;
      }

      // Copy the original RGB to the destination
      pixels[j] = r;
      pixels[j + 1] = g;
      pixels[j + 2] = b;
      pixels[j + 3] = 255;

      // Unset the original
      pixels[i + 3] = 0;

      updates++;
    }
  }
  updatePixels();

  if (updates / (width * height) < 0.001) {
    flip();
  }
}
