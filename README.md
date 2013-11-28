# SC2 Ranks for Javascript

A NodeJS Javascript library for accessing the API from [SC2
Ranks](http://www.sc2ranks.com/).

## Why?

I suck at Starcraft but I'm awesome at Javascript.

## Installing

```
npm install sc2ranks
```

## Usage

All examples require you to setup a data context to the API with your key. You
can get your SC2 Ranks key from [here](http://www.sc2ranks.com/usercp/api).

```javascript
var sc2 = require('sc2ranks');
var api = new sc2.Context('your-api-key');
```

### Get a Player

Create a `Player` model by passing in a Battle.NET ID and a region to the API
factory function:

```javascript
var player = api.factory(Player, 2840641, sc2.REGIONS.US);
```

To fetch the player's info, call the `fetch()` method, which returns a
[Q](https://github.com/kriskowal/q) promise;

```javascript
var promise = player.fetch();

promise.done(function() { console.log(player); });
```

As a query:

```javascript
new sc2.Query(api)
  .from(sc2.Players)
  .where(sc2.Region, sc2.REGIONS.US)
  .where(sc2.BattleNetId, 2840641)
  .first()
  .then(function(player) {
    console.log(player);
  })
  .fail(function(err) {
    console.log('error', err);
  });
```

### Get a Player's Teams

```javascript
var player = api.factory(Player, 2840641, sc2.REGIONS.US);

player.getTeams()
  .done(function() {
    console.log(player.teams);
  });
```

As a query:

```javascript
new sc2.Query(api)
  .from(sc2.Teams)
  .where(sc2.Region, sc2.REGIONS.US)
  .where(sc2.BattleNetId, 2840641)
  .where(sc2.Race, sc2.RACES.TERRAN)
  .where(sc2.League, sc2.GRANDMASTER)
  .select()
  .done(function(teams) {
    console.log(teams);
  });
```

