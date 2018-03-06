[![Build Status](https://api.travis-ci.org/afanasy/db3-set.svg)](https://travis-ci.org/afanasy/db3-set)

Transforming rules in JSON format

### When is this useful?
If you want to use the same transforming rules for js and SQL `set`.

### Usage
```js
var set = require('db3-set')
set.query(rule)
//returns corresponding sql `set` clause
set.transform(rule)
//returns js function
```
#### SQL set
```js
set.query({id: 1, name: 'Apple'})
// returns `id` = 1, name = 'Apple'
set.query({created: {now: true}})
// returns `created` = now()
set.query({rating: {'+=': 1}})
// returns `rating` = rating + 1
```

#### Transform function
```js
var fruit = {name: 'Apple', rating: 1}
set.transform({rating: 2})(fruit)
// fruit will be
// {name: 'Apple', rating: 2}
set.transform({created: {now: true}})(fruit)
// fruit will be
// {name: 'Apple', rating: 1, created: '2015-11-09 14:45:00'}
set.transform({rating: {'+=': 2}})(fruit)
// fruit will be
// {name: 'Apple', rating: 3}
```
