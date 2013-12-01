var Character = require('./models/Character.js');
var Clan      = require('./models/Clan.js');
var Team      = require('./models/Team.js');

var moment = require('moment');

module.exports = (function() {

  // Can create transform functions for handling the various models
  function Parser(api)
  {
    if (!api)
      throw 'Missing Sc2Ranks API instance';

    this._api = api;

    // Bind it all
    this.character = this.character.bind(this);
    this.clan = this.clan.bind(this);
  }

  // Character data object into a proper model
  Parser.prototype.character = function(data, character)
  {
    character = character || this._api.factory(Character);

    character.name              = data.name;
    character.region            = data.region;
    character.url               = data.url;
    character.vodUrl            = data.vod_url;
    character.replayUrl         = data.replay_url;
    character.bnetId            = 0|data.bnet_id;
    character.achievementPoints = 0|data.achievement_points;
    character.lastUpdate        = moment(data.updated_at*1000);

    if (data.clan) {
      character.clan = this._api.factory(Clan, data.clan.url);
    }

    if (data.swarm_levels) {
      character.swarmLevels.zerg = 0|data.swarm_levels.zerg;
      character.swarmLevels.protoss = 0|data.swarm_levels.protoss;
      character.swarmLevels.terran = 0|data.swarm_levels.terran;
    }

    return character;
  };

  Parser.prototype.teams = function(data, teams)
  {
    teams = teams || [];
    var _this = this;
    data.forEach(function(t) {
      var team = _this._api.factory(Team);
      team.url = t.url;
      team.rankRegion = t.rank_region;
      team.league = t.league;
      team.random = !!t.random;
      team.points = 0|t.points;
      team.wins = 0|t.wins;
      team.losses = 0|t.losses;
      team.worldRank = 0|t.rankings.world;
      team.regionRank = 0|t.rankings.region;
      team.lastUpdate = moment(t.updated_at*1000);
      team.lastMatch = moment(t.last_game_at*1000);
      team.expansion = t.expansion;
      team.characters = [];
      t.characters.forEach(function(c) {
        var character = _this._api.factory(Character);
        _this.character(c, character);
        team.characters.push(character);
      });
      teams.push(team);
    });

    return teams;
  };

  // Clan data into proper model
  Parser.prototype.clan = function(data, clan)
  {
    clan = clan || this._api.factory(Clan);

    clan.url          = data.url;
    clan.tag          = data.tag;
    clan.region       = data.region;
    clan.description  = data.description;
    clan.members      = 0|data.members;
    clan.lastUpdate   = moment(data.updated_at*1000);
    clan.topScore     = 0|data.scores.top;
    clan.averageScore = 0|data.scores.avg;
    clan.sumScore     = 0|data.scores.sum;

    return clan;
  };

  return Parser;

})();
