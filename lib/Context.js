var Query      = require('./Query.js');
var httpinvoke = require('httpinvoke');
var Q          = require('q');
var moment     = require('moment');
var Player     = require('./Player.js');
var Team       = require('./Team.js');
var constants  = require('./constants.js');

module.exports = (function() {

  Context.BASE_URL = 'http://api.sc2ranks.com/v2/';

  function Context(apiKey)
  {
    if (!apiKey)
      throw 'Missing API key';

    this._key        = apiKey;
    this.Players     = new Query(this).from(constants.Players);
    this.creditsLeft = 0;
  }

  Context.prototype.factory = function(T)
  {
    var thing = new (T.bind.apply(T, arguments))();
    thing._api = this;
    return thing;
  };

  // Return a Q-Promise for a fetched thing w/ URL prefix
  Context.prototype.get = function(urlPrefix, method, options)
  {
    method = method || 'GET';
    var url = Context.BASE_URL + urlPrefix + '?api_key=' + this._key;
    var ret = Q.defer();

    var _this = this;
    console.log('getting', url);
    httpinvoke(url, method, options).then(function(resp) {
      var data = JSON.parse(resp.body);

      // Server-side error
      if (data.error) {
        ret.reject(data.error);
        return;
      }

      // API info
      _this.creditsLeft = 0|resp.headers['x-credits-left'];

      ret.resolve(data);

    }, function(err) {
      // Bad error
      ret.reject(err);
    });

    return ret.promise;

  };

  Context.prototype.getPlayerData = function(bnetId, region)
  {
    return this.get('characters/' + region + '/' + bnetId);
  };

  Context.prototype.getTeamsData = function(bnetId, region, options)
  {
    var s = Object.keys(options).map(function(key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(options[key]);
    }).join('&');

    return this.get('characters/teams/' + region + '/' + bnetId, 'POST', {
      input: s
    });
  };

  Context.prototype.teamsParser = function(teams)
  {
    var _this = this;
    teams = teams || [];
    return function(data) {
      data.forEach(function(d) {
        var team = new Team();
        team._api            = _this;
        team.wins            = 0|d.wins;
        team.losses          = 0|d.losses;
        team.points          = 0|d.points;
        team.rankings.world  = 0|d.rankings.world;
        team.rankings.region = 0|d.rankings.region;
        team.random          = !!d.random;
        team.bracket         = d.bracket;
        team.expansion       = d.expansion;
        team.url             = d.url;
        team.lastMatch       = moment(d.last_game_at*1000);

        d.characters.forEach(function(c) {
          var p = _this.playerParser()(c);
          team.players.push(p);
        });

        teams.push(team);
      });

      return teams;
    };
  };

  Context.prototype.playerParser = function(player)
  {
    var _this = this;
    player = player || new Player();
    return function(data) {
      player._api              = _this;
      player.bnetId            = data.bnet_id;
      player.clanTag           = data.clan.tag;
      player.name              = data.name;
      player.region            = data.region;
      player.url               = data.url;
      player.vodUrl            = data.vod_url;
      player.replayUrl         = data.replay_url;
      player.achievementPoints = 0|data.achievement_points;
      player.lastUpdate        = moment(data.updated_at*1000);
      if (data.swarm_levels) {
        player.swarmLevels.zerg = 0|data.swarm_levels.zerg;
        player.swarmLevels.protoss = 0|data.swarm_levels.protoss;
        player.swarmLevels.terran = 0|data.swarm_levels.terran;
      }
      return player;
    };
  };

  return Context;

})();
