module.exports = (function() {

  function Character(id, region, name, url)
  {
    // Attempt to parse URL if only passed a single param
    if (id && !region) {
      var _ref = parseUrl(id);
      if (!_ref)
        throw 'Invalid constructor parameters';
      url    = id;
      id     = _ref.id;
      region = _ref.region;
      name   = _ref.name;
    }

    this.bnetId            = id || null;
    this.region            = region || null;

    this.name              = name || '';
    this.achievementPoints = 0;
    this.url               = url || '';
    this.vodUrl            = '';
    this.replayUrl         = '';
    this.teams             = [];
    this.clan              = null;
    this.lastUpdate        = null;
    this.swarmLevels       = {
      zerg: 0,
      protoss: 0,
      terran: 0
    };

    // API link
    Object.defineProperties(this, {
      _api: {
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  Character.prototype.fetch = function()
  {
    if (!this._api)
      throw 'No data context';

    if (!this.bnetId || !this.region)
      throw 'Missing region or id';

    var _this = this;
    return this._api.getCharacterData(this.bnetId, this.region)
    .then(function(data) {
      _this._api.parser.character(data, _this);
    });
  };

  // Get full teams and clan info
  Character.prototype.fetchAll = function()
  {
    if (!this._api)
      throw 'No data context';

    if (!this.bnetId || !this.region)
      throw 'Missing region or id';

    var _this = this;
    return this.fetch().then(function() {
      return _this.fetchTeams();
    })
    .then(function() {
      if (_this.clan)
        return _this.clan.fetch();
      else
        return _this;
    });
  };

  Character.prototype.fetchTeams = function()
  {
    if (!this._api)
      throw 'No data context';

    if (!this.bnetId || !this.region)
      throw 'Missing region or id';

    var _this = this;
    return this._api.getTeamsData(this.bnetId, this.region)
    .then(function(data) {
      _this.teams = [];
      _this._api.parser.teams(data, _this.teams);
    });
  };

  // Return the id, region duple based on a url
  function parseUrl(url)
  {
    var match = url.match(/character\/(\w+)\/(\d+)\/(\w+)\//);
    if (!match) return false;
    return {
      region: match[1],
      id: match[2],
      name: match[3]
    };
  }

  return Character;

})();
