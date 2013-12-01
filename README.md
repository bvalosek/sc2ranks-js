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

## More Examples

### Fetching Character and Clan details

Also shows how to use `fail()` in the promise chain to catch any errors and how
to inspect your `api` instance to see how many credits you have left.

```javascript
var character = api.factory(Character, 995794, sc2.REGIONS.US);

character.fetch()
.then(function() {
  return character.clan.fetch();
})
.then(function() {
  console.log(character);
  console.log('remaining credits', api.creditsLeft);
})
.fail(function(err) {
  console.log('error', err);
});
```

### Get a player's 1v1 team(s)

```javascript
new api.Query()
  .from(sc2.Teams)
  .where(sc2.BattleNetId, 4098270)
  .where(sc2.Region, 'kr')
  .where(sc2.Bracket, '1v1')
  .select()
  .then(function(teams) {
    teams.forEach(function(team) {
      console.log(team);
    });
  });
```

### Get detailed player information.

Use the `fetchAll()` method on a `Character` to get full team and clan info.

```javascript
var character = api.factory(Character, 995794, 'us');

character.fetchAll().then(function() { ... });
```


## License
Copyright 2013 Brandon Valosek

**sc2ranks-js** is released under the MIT license.

