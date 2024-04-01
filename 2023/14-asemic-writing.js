let url;
let titleToRender;
let textToRender;

let nextButton;
let wikiButton;

const CHAR_SIZE = 4;

function setup() {
  createCanvas(400, 400);
  noLoop();
  
  nextButton = createButton("next");
  nextButton.mousePressed(renderRandomPage);
  
  wikiButton = createButton("open");
  wikiButton.mousePressed(() => {
    window.open(url, '_blank');
  });
  
  renderRandomPage();
}

function renderRandomPage() {
  wikiButton.attribute('disabled', '');
  
  // https://stackoverflow.com/a/70225116
  async function go() {
    let title;
    {
      let json = await httpGet(`https://en.wikipedia.org/w/api.php?action=query&format=json&generator=random&grnlimit=1&grnnamespace=0&prop=info&origin=*`, 'json');
      let pages = json.query.pages;
      let id = Object.keys(pages)[0];
      title = pages[id].title;
      url = `https://en.wikipedia.org/wiki/${title}`;
    }
    
    let body;
    {
      let json = await httpGet(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${title}&prop=extracts&explaintext&origin=*`, 'json');
      let pages = json.query.pages;
      let id = Object.keys(pages)[0];
      body = pages[id].extract;
    }
    
    return [title, body];
  }
  
  background(255);
  text("Loading...", 10, 20);
  
  go().then(([title, body]) => {
    background(255);

    let x = 10, y = 30;
    for (let word of body.trim().split(/\s+/)) {
      drawWord(x, y, word);
      x += word.length * CHAR_SIZE;

      if (x + 10 > width) {
        x = 10;
        y += CHAR_SIZE * 2;
      }
    }
    
    stroke("black");
    fill("white");
    rect(10, 10, width - 20, 14);
    
    noStroke();
    fill("black");
    text(title, 12, 22);
    
    wikiButton.removeAttribute('disabled');
  });
}

function drawWord(x, y, word) {
  let letters = word.toLowerCase().replace(/[^a-z]/, '');
  
  stroke("black");
  strokeWeight(1);
  noFill();
  
  push();
  translate(x, y);
  rotate(PI / -2.0);
  for (let i = 0; i < letters.length; i++) {
    let a = PI / 2 + (letters.charCodeAt(i) - 'a'.charCodeAt(0) - 13) / 13.0 * 1.1;
    let x = CHAR_SIZE * cos(a);
    let y = CHAR_SIZE * sin(a);
    line(0, 0, x, y);
    translate(x, y);
  }
  circle(0, 0, CHAR_SIZE / 4);
  pop();
}
