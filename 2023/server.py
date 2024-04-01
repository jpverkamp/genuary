import flask
import os

app = flask.Flask(__name__)

TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Genuary 2023 - {{ title }}</title>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js" integrity="sha512-WIklPM6qPCIp6d3fSSr90j+1unQHUOoWDS4sdTiR8gxUTnyZ8S2Mr8e10sKKJ/bhJgpAa/qG068RDkg6fIlNFA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/addons/p5.sound.min.js" integrity="sha512-wM+t5MzLiNHl2fwT5rWSXr2JMeymTtixiw2lWyVk1JK/jDM4RBSFoH4J8LjucwlDdY6Mu84Kj0gPXp7rLGaDyA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>    
    
    <script src="https://unpkg.com/p5.gui.variables@1.0.1/libraries/quicksettings.js" integrity="sha384-XlyRxqW2TTF2gFC0VpBI8OqnCTsZOdgrhBFikxYD4hEu68QdNQ64kiej07hCAiJq" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://unpkg.com/p5.gui.variables@1.0.1/libraries/p5.gui.js" integrity="sha384-/Uy+8NNvYJjG164REYQP/RnqVcrnsFTtnoCJcLg/tVBKaHUaovtr+ZJgKQKHGAPW" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.2/addons/p5.sound.min.js" integrity="sha512-WzkwpdWEMAY/W8WvP9KS2/VI6zkgejR4/KTxTl4qHx0utqeyVE0JY+S1DlMuxDChC7x0oXtk/ESji6a0lP/Tdg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <style>
        canvas {
            border: 1px solid black;
            border-radius: 1em;
        }

        form { 
            margin-bottom: 1em;
        }
    </style>
</head>
<body>
    <h1>Genuary 2023 - {{ title }}</h1>
    <form action="/" method="get">
        <select name="q" onchange="this.form.submit();">
        {% for script in scripts %}
            <option value="{{ script }}" {% if script == title %}selected{% endif %}>{{ script }}</option>
        {% endfor %}
        </select>
        <input type="submit" value="Load" />
    </form>

    <script>
{{ js | safe }}

var oldSetup = setup;
setup = () => {
    // Load saved settings from the browser hash fragment
    if (parent.location.hash && typeof params !== "undefined") {
        try {
            var settings = JSON.parse(atob(parent.location.hash.substring(1)));
            Object.keys(params).forEach((key) => params[key] = settings[key] || params[key]);
        } catch(ex) {
        }
    }

    oldSetup();

    createButton("play/pause").mousePressed(() => {
        if (isLooping()) {
        noLoop();
        } else {
        loop();
        }
    });

    createButton("save").mousePressed(() => {
        saveCanvas('photo', 'png')
    });

    createButton("clear").mousePressed(() => {
        if (typeof reset !== 'undefined') {
            reset();
        } else {
            clear();
        }
    });

    if (typeof params !== "undefined") {
        for (var el of document.querySelectorAll('input')) {
            if (el.id && el.id.startsWith('qs_')) {
                el.addEventListener('change', () => {
                    parent.location.hash = btoa(JSON.stringify(params));
                });
            }
        }
    }
}        
    </script>
</body>
</html>
'''


@app.route('/')
def index():
    scripts = list(sorted(f for f in os.listdir('.') if f.endswith('.js')))
    script = flask.request.args.get('q', scripts[0])

    if script not in scripts:
        return flask.abort(418)

    with open(script, 'r') as f:
        js = f.read()

    return flask.render_template_string(TEMPLATE, scripts=scripts, title=script, js=js)

if __name__ == '__main__':
    app.run(port=5000, debug=True)