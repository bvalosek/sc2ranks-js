var constants = require('./lib/constants.js');

var SC2Ranks = module.exports = {

  Context: require('./lib/Context.js'),
  Query: require('./lib/Query.js')

};

// Mixin
for (var key in constants) {
  var value = constants[key];
  SC2Ranks[key] = value;
}

