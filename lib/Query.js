var Player = require('./Player.js');

module.exports = (function() {

  Query.PLAYERS = 'characters/';
  Query.TEAMS = 'characters/teams/';

  function Query(context)
  {
    if (!context)
      throw 'Missing API context';

    this.context = context;

    this._region    = null;
    this._bnetId    = null;
    this._expansion = null;
    this._bracket   = null;
    this._league    = null;
    this._race      = null;
    this._base      = '';
  }

  Query.prototype.from = function(base)
  {
    var q = this.clone();
    q._base = base;
    return q;
  };

  // Doop
  Query.prototype.clone = function()
  {
    var q = new Query(this.context);
    for (var key in this) {
      if (!this.hasOwnProperty(key)) continue;
      var value = this[key];
      q[key] = value;
    }
    return q;
  };

  // Specify a filter
  Query.prototype.where = function(property, value)
  {
    var param = '_' + property;
    if (this[param] === undefined)
      throw 'Invalid where property: ' + property;
    if (this[param])
      throw 'Cannot filter on same property multiple times';

    var q = this.clone();
    q[param] = value;
    return q;
  };

  Query.prototype.skip = function(amount)
  {
    var q = this.clone();
    return q;
  };

  Query.prototype.take = function(amount)
  {
    var q = this.clone();
    return q;
  };

  // Do it
  Query.prototype.select = function(f)
  {
    f = f || function(x) { return x; };
    // If all we have is the region and battle net ID, return a single
    // character
    if (this._bnetId && this._region && this._base === Query.PLAYERS) {
      var url = 'characters/' + this._region + '/' + this._bnetId;
      return this.context.get(url)
        .then(this.context.playerParser())
        .then(f)
        .then(function(player) { return [player]; });
    }

    else if (this._bnetId && this._region && this._base === Query.TEAMS) {
      var opts =  {
        expansion: this._expansion || 'hots',
        bracket: this._bracket || 'all',
        league: this._league || 'all'
      };
      if (this._race) opts.race = this._race;
      return this.context.getTeamsData(this._bnetId, this._region, opts)
      .then(this.context.teamsParser());
    }
  };

  Query.prototype.first = function()
  {
    return this.select().then(function(r) { return r[0]; });
  };

  return Query;

})();
