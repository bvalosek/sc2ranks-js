var constants = require('./lib/constants.js');

var SC2Ranks = module.exports = {

  Connection: require('./lib/Sc2Ranks.js'),

  Clan: require('./lib/models/Clan.js'),
  Character: require('./lib/models/Character.js')

};

// Mixin constants
for (var key in constants) {
  var value = constants[key];
  SC2Ranks[key] = value;
}

