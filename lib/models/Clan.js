module.exports = (function() {

  function Clan(tag, region, url)
  {
    if (!region) {
      var _ref = parseUrl(tag);
      if (!_ref)
        throw 'Invalid constructor parameters';
      url = tag;
      tag = _ref.tag;
      region = _ref.region;
    }
    this.region       = regionToRankRegion(region) || '';
    this.tag          = tag || '';

    this.url          = url || '';
    this.description  = '';
    this.members      = 0;
    this.lastUpdate   = null;
    this.averageScore = 0;
    this.topScore     = 0;
    this.sumScore     = 0;

    Object.defineProperties(this, {
      _api: {
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  Clan.prototype.fetch = function()
  {
    if (!this._api)
      throw 'No data context';

    if (!this.tag || !this.region)
      throw 'Missing region or tag';

    var _this = this;
    return this._api.getClanData(this.tag, this.region)
    .then(function(data) {
      _this._api.parser.clan(data, _this);
    });
  };

  function regionToRankRegion(region)
  {
    switch (region) {
      case 'us':
        return 'am';
      case 'global':
        return 'global';
      default:
        return region;
    }
  }

  // Return the id, region duple based on a url
  function parseUrl(url)
  {
    var match = url.match(/clan\/(\w+)\/(\w+)/);
    if (!match) return false;
    return {
      region: regionToRankRegion(match[1]),
      tag: match[2]
    };
  }

  return Clan;

})();
