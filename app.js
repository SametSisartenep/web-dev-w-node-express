var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var formidable = require('formidable');

var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function ( name, options ) {
      if (!this._sections) {
        this._sections = {};
      }
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

var fortune = require('./lib/fortune');
var weather = require('./lib/weather');
var credentials = require('./credentials');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(function ( req, res, next ) {
  res.set('X-Powered-By', 'Node.js Awesomeness');

  next();
});

app.use(function ( req, res, next ) {
  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';

  next();
});

app.use(function ( req, res, next ) {
  if (!res.locals.partials) {
    res.locals.partials = {};
  }
  res.locals.partials.weather = weather.getWeatherData();

  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

// Routes
app.get('/', function ( req, res ) {
  res.render('home');

  res.cookie('monster', 'nom nom');
  res.cookie('signed_monster', 'nom nom', { signed: true });

  res.session.userName = 'Anonymous';
  //var colorScheme = req.session.colorScheme || 'dark';
  // Removing the 'session'
  //delete req.session.colorScheme
});

app.get('/about', function ( req, res ) {
  res.render('about', {
    fortune:  fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
});

app.get('/tours/hood-river', function ( req, res ) {
  res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function ( req, res ) {
  res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function ( req, res ) {
  res.render('tours/request-group-rate');
});

app.use(express.static(__dirname + '/public'));

// Request Header information
app.get('/headers', function ( req, res ) {
  res.set('Content-Type', 'text/html');
  var s = [];
  for (var name in req.headers) {
    s.push(name + ': ' + req.headers[name] + '\n');
  }
  res.render('headers', {
    headers: s
  });
});

app.get('/foo', function ( req, res ) {
  //res.render('foo', { layout: null });
  res.render('foo', { layout: 'microsite' });
});

app.get('/jquery-test', function ( req, res ) {
  res.render('jquery-test', { layout: 'test' });
});

app.get('/nursery-rhyme', function ( req, res ) {
  res.render('nursery-rhyme', { layout: 'test' });
});

app.get('/data/nursery-rhyme', function ( req, res ) {
  res.json({
    animal: 'squirrel',
    bodyPart: 'tail',
    adjective: 'bushy',
    noun: 'heck'
  });
});

app.get('/newsletter', function ( req, res ) {
  // We will learn more about CSRF later... for now, we just provide a
  // dummy value
  res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.get('/contest/vacation-photo', function ( req, res ) {
  var now = new Date();
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.get('/info-cookie', function ( req, res ) {
  res.render('info-cookie', {
    cookie: req.cookies.monster,
    secretCookie: req.signedCookies.monster
  });

  console.log('Cookies: ' + JSON.stringify(req.cookies));
  console.log('Signed Cookies: ' + JSON.stringify(req.signedCookies));
});

/**

app.post('/process', function ( req, res ) {
  console.log('Form (from querystring): ' + req.query.form);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
  res.redirect(303, '/thank-you');
});

**/
app.post('/process', function ( req, res ) {
  if (req.xhr || req.accepts('json,html') === 'json') {
    // if there were an error, we would send { error: 'error description' }
    res.send({ success: true });
  } else {
    res.redirect(303, '/thank-you');
  }
});

app.post('/contest/vacation-photo/:year/:month', function ( req, res ) {
  var form = new formidable.IncomingForm();
  form.parse(req, function ( err, fields, files ) {
    if (err) {
      return res.redirect(303, '/error');
    }

    console.log('received fields: ');
    console.log(fields);
    console.log('received files: ');
    console.log(files);
    res.redirect(303, '/thank-you');
  });
});

// custom 404 page
app.use(function ( req, res ) {
  res.status(404);
  res.render('404');
});

//custom 500 page
app.use(function ( err, req, res, next ) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started at http://localhost:' + app.get('port'));
});
