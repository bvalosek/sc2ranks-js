var httpinvoke = require('httpinvoke');
var Q          = require('q');
var _          = require('underscore');
var moment     = require('moment');

var constants = require('./constants.js');
var Parser    = require('./Parser.js');

module.exports = (function() {

  Connection.BASE_URL = 'http://api.sc2ranks.com/v2/';

  function Connection(apiKey)
  {
    if (!apiKey)
      throw 'Missing API key';

    this._key        = apiKey;
    this.parser      = new Parser(this);
    this.creditsLeft = 0;
  }

  // Create a model with the API initialized to this context
  Connection.prototype.factory = function(TModel)
  {
    var thing = new (TModel.bind.apply(TModel, arguments))();
    thing._api = this;
    return thing;
  };

  // Fetch character detail
  Connection.prototype.getCharacterData = function(bnetId, region)
  {
    return this._get('characters/' + region + '/' + bnetId);
  };

  // Fetch all teams for a character
  Connection.prototype.getTeamsData = function(bnetId, region, options)
  {
    options = _(options || {}).defaults({
      expansion: constants.EXPANSIONS.HOTS,
      bracket: constants.BRACKETS['1V1'],
      league: constants.LEAGUES.ALL
    });

    return this._get('characters/teams/' + region + '/' + bnetId, options);
  };

  // Search on character name and other filters, returns teams
  Connection.prototype.getSearchData = function(name, options)
  {
    options = _(options || {}).defaults({
      name: name || '',
      match: 'extact',
      rank_region: constants.RANK_REGIONS.GLOBAL,
      expansion: constants.EXPANSIONS.HOTS,
      bracket: constants.BRACKETS['1V1'],
      league: constants.LEAGUES.ALL
    });

    return this._get('characters/search', options);
  };

  // Get information about a clan
  Connection.prototype.getClanData = function(tag, rankRegion, options)
  {
    rankRegion = rankRegion || constants.RANK_REGIONS.GLOBAL;
    options = _(options || {}).defaults({
      bracket: constants.BRACKETS['1V1']
    });

    return this._get('clans/' + rankRegion + '/' + tag, options);
  };

  // Get list of players in a clan
  Connection.prototype.getCharacterClanData = function(tag, rankRegion, options)
  {
    rankRegion = rankRegion || constants.RANK_REGIONS.GLOBAL;
    options = _(options || {}).defaults({
      bracket: constants.BRACKETS['1V1'],
      page: 1,
      limit: 50
    });

    return this._get('clans/characters/' + rankRegion + '/' + tag, options);
  };

  // Get list of teams in a clan
  Connection.prototype.getTeamClanData = function(tag, rankRegion, options)
  {
    rankRegion = rankRegion || constants.RANK_REGIONS.GLOBAL;
    options = _(options || {}).defaults({
      bracket: constants.BRACKETS['1V1'],
      expansion: constants.EXPANSIONS.HOTS,
      league: constants.LEAGUES.ALL,
      page: 1,
      limit: 50
    });

    return this._get('clans/teams/' + rankRegion + '/' + tag, options);
  };

  // Primary method to actually fetch from the API. Automatically POSTs when we
  // pass in params
  Connection.prototype._get = function(urlPrefix, params)
  {
    method = params ? 'POST' : 'GET';
    var url = Connection.BASE_URL + urlPrefix + '?api_key=' + this._key;
    var ret = Q.defer();

    // POST options if param is provided
    var options = {};
    if (params) {
      options.input = Object.keys(params).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    }

    console.log(method, url);
    if (options.input)
      console.log('input', options.input);

    // Fire off the request
    var _this = this;
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
      ret.reject(err);
    });

    return ret.promise;
  };

  return Connection;

})();
