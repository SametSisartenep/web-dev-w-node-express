var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var fortune = require('./lib/fortune');
var weather = require('./lib/weather');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

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

// Routes
app.get('/', function ( req, res ) {
  res.render('home');
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
