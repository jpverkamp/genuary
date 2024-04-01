let params = {
  letterCount: 10,
  letterSize: 12,
  letterSizeMin: 1,
  letterSizeMax: 48,
  letterSizeVariance: 0.0,
  letterSizeVarianceMin: 0.0,
  letterSizeVarianceMax: 1.0,
  letterSizeVarianceStep: 0.01,

  speed: 0.5,
  speedMin: 0.1,
  speedMax: 4.0,
  speedStep: 0.01,
  speedVariance: 0.0,
  speedVarianceMin: 0.0,
  speedVarianceMax: 10.0,
  speedVarianceStep: 0.01,

  color: "#0fff00",

  fadeRate: 0.1,
  fadeRateMin: 0,
  fadeRateMax: 0.3,
  fadeRateStep: 0.01,

  characterSet: ["unknown"],
};
let letters;

let characterSets = [
  ["latin", "A", "Z"],
  ["cjk", "一", "龯"],
  // ['cuneiform', '𒀀', '𒎙'],
  ["runic", "ᚠ", "ᛪ"],
  ["greek", "α", "ω"],
];

function randomChar(min, max) {}

function randomLetter() {
  for (let [name, min, max] of characterSets) {
    if (params.characterSet == name) {
      return String.fromCharCode(
        random(min.charCodeAt(0), max.charCodeAt(0) + 1)
      );
    }
  }

  return "☹️";
}

class Letter {
  constructor(c, x, s) {
    this.x = x;
    this.y = -1 * random(height);
    this.c = c;
    this.s = s + s * (random() + 0.5) * params.letterSizeVariance;
    this.sv = (random() - 0.5) * params.speedVariance;
  }

  update() {
    this.y += this.s * params.speed + this.sv * params.speed;
  }

  draw() {
    textSize(this.s);
    noStroke();
    fill(params.color);
    text(this.c, this.x, this.y);
  }
}

class Letters {
  constructor() {
    this.letters = [];
  }

  update() {
    while (this.letters.length < params.letterCount) {
      this.letters.push(
        new Letter(randomLetter(), random(width), params.letterSize)
      );
    }

    for (let letter of this.letters) {
      letter.update();
    }

    for (let i = 0; i < this.letters.length; i++) {
      if (this.letters[i].y > height && random() > 0.95) {
        this.letters.splice(i, 1);
        i--;
      }
    }
  }

  draw() {
    for (let letter of this.letters) {
      letter.draw();
    }
  }
}

function setup() {
  createCanvas(400, 400);
  background(0);

  params.characterSet = [];
  for (let [name, min, max] of characterSets) {
    params.characterSet.push(name);
  }

  gui = createGuiPanel("params");
  gui.addObject(params);
  gui.setPosition(420, 130);

  letters = new Letters();
}

function draw() {
  background(0, parseInt(255 * params.fadeRate));

  letters.update();
  letters.draw();
}
