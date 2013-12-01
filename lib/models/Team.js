module.exports = (function() {

  function Team()
  {
    this.rankRegion = '';
    this.url        = '';
    this.expansion  = '';
    this.bracket    = '';
    this.points     = 0;
    this.wins       = 0;
    this.losses     = 0;
    this.random     = false;
    this.characters = [];
    this.lastMatch  = null;

    Object.defineProperties(this, {
      _api: {
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  return Team;

})();
