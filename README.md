# SC2 Ranks for Javascript

A NodeJS Javascript library for accessing the API from [SC2
Ranks](http://www.sc2ranks.com/).

Get access to player, clan, team, and division stats with server-side
Javascript.

## Why?

I suck at Starcraft but I'm awesome at Javascript.

## Installing

```
npm install sc2ranks
```

## Usage

All examples require you to setup a connection to the API with your key. You
can get your SC2 Ranks key from [here](http://www.sc2ranks.com/usercp/api).

```javascript
var sc2 = require('sc2ranks');
var api = new sc2.Connection('your-api-key');
```

### Fetching data from the API

You can directly create `Character`, `Clan`, `Team`, or `Division` objects and
then `fetch()` them, which will return a promise.

```javascript
var character = api.factory(Character, 287490, sc2.REGIONS.US);

character.fetch().then(function() { ... });
```

### Using the Query Builder

```javascript
new api.Query()
  .from(sc2.Characters)
  .where(sc2.BattleNetId, 287490)
  .where(sc2.Region, sc2.REGIONS.US)
  .first()
  .then(function(character) { ... });
```

### Calling the API Directly

You can access the API functions directly off the connection object, returning
a promise for the raw data response from SC2 Ranks.

```javascript
api.getCharacterData(287490, sc2.REGIONS.US).then(function(data) { ... });
```

See the [official SC2 Ranks documentation](http://www.sc2ranks.com/api) for
details on these methods.

* getCharacterData (`battleNetId`, `region`)
* getClanData (`clanTag`, `rankRegion`, `options`)

## Examples
