var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function ( req, res ) {
  res.type('text/html');
  res.send('<h1>Meadowlark Travel site.</h1>');
});

app.get('/about', function ( req, res ) {
  res.type('text/html');
  res.send('<h1>Meadowlark Travel site. About page</h1>');
});

// custom 404 page
app.use(function ( req, res ) {
  res.type('text/html');
  res.status(404);
  res.send('<h1>404 - Not Found</h1>');
});

//custom 500 page
app.use(function ( err, req, res, next ) {
  console.error(err.stack);
  res.type('text/html');
  res.status(500);
  res.send('<h1>500 - Internal Server Error</h1>');
});

app.listen(app.get('port'), function () {
  console.log('Express started at http://localhost:' + app.get('port'));
});
