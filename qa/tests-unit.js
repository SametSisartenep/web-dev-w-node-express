var fortune = require('../lib/fortune');
var weather = require('../lib/weather');
var expect = require('chai').expect;

suite('Fortune cookie tests', function () {
  test('getFortune() should return a fortune', function () {
    expect(typeof fortune.getFortune() === 'string');
  });
});

suite('Weather info tests', function () {
  test('getWeatherData() should return an object', function () {
    var weatherData = weather.getWeatherData();
    expect(typeof weatherData === 'object' && !Array.isArray(weatherData));
  });
});
