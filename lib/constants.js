var data = require('./data.json');

// Load in the constants from the provided API data
var CONSTANTS = module.exports = {};
for (var key in data) {
  var section = data[key];
  var SECTION = CONSTANTS[key.toUpperCase()] = {};
  for (var pkey in section) {
    SECTION[pkey.toUpperCase()] = pkey;
  }
}
