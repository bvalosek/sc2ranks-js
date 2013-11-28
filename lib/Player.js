module.exports = (function() {

  function Player(id, region)
  {
    this.bnetId            = id || null;
    this.region            = region || null;
    this.name              = '';
    this.clanTag           = '';
    this.achievementPoints = 0;
    this.url               = '';
    this.vodUrl            = '';
    this.replayUrl         = '';
    this.teams             = [];
    this.lastUpdate        = null;
    this.swarmLevels       = {
      zerg: 0,
      protoss: 0,
      terran: 0
    };

    Object.defineProperties(this, {
      _api: {
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  Player.prototype.fetch = function()
  {
    return this._api
      .getPlayerData(this.bnetId, this.region)
      .then(this._api.playerParser(this));
  };

  Player.prototype.getTeams = function()
  {
    return this._api
      .getTeamsData(this.bnetId, this.region, {
        expansion: 'hots',
        bracket: 'all',
        league: 'all'
      })
      .then(this._api.teamsParser(this.teams));
  };

  return Player;

})();
