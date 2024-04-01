let url;
let titleToRender;
let wordsToRender;
let wordIndex;

let nextButton;
let wikiButton;

const CHAR_SIZE = 60;

function setup() {
  createCanvas(400, 400);
  frameRate(10);
  
  nextButton = createButton("next");
  nextButton.mousePressed(renderRandomPage);
  
  wikiButton = createButton("open");
  wikiButton.mousePressed(() => {
    window.open(url, '_blank');
  });
  
  wordsToRender = [];
  wordIndex = 0;
  
  renderRandomPage();
}

function draw() {
  if (wordIndex > wordsToRender.length) {
    noLoop();
  }
  
  clear();
  textSize(CHAR_SIZE);
  for (let i = 0; i < height / CHAR_SIZE; i++) {
    if (i == 3) {
      fill("black");
    } else {
      fill("lightgray");
    }
    
    text(
      wordsToRender[wordIndex + i],
      10,
      CHAR_SIZE * (i + 1)
    );
  }
  
  stroke("black");
  line(
    width - 10, 
    10, 
    width - 10, 
    height - 10
  );
  circle(
    width - 10,
    1.0 * wordIndex / wordsToRender.length * (height - 20),
    20
  );
  
  wordIndex++;
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
    titleToRender = title;
    wordsToRender = body.trim().split(/\s+/);
    wordIndex = 0;
    wikiButton.removeAttribute('disabled');
    loop();
  });
}
