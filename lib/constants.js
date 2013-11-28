var data = require('./data.json');

var CONSTANTS = {};
for (var key in data) {
  var section = data[key];
  var SECTION = CONSTANTS[key.toUpperCase()] = {};
  for (var pkey in section) {
    SECTION[pkey.toUpperCase()] = pkey;
  }
}

// my own constants
CONSTANTS.Players     = 'characters/';
CONSTANTS.Teams       = 'characters/teams/';
CONSTANTS.BattleNetId = 'bnetId';
CONSTANTS.Region      = 'region';
CONSTANTS.Race        = 'race';
CONSTANTS.League      = 'league';
CONSTANTS.Bracket     = 'bracket';

module.exports = CONSTANTS;
