var _ = require('underscore')
var assert = require('assert')
var set = require('./')

describe('#set', function () {
  describe('#query', function () {
    it('translates number', function () {
      assert.equal(set.query(1), '`id` = 1')
    })
    it('translates object', function () {
      assert.equal(set.query({id: 1, name: 'Adam'}), '`id` = 1, `name` = \'Adam\'')
    })
    it('translates object with now', function () {
      assert.equal(set.query({created: {now: true}}), '`created` = now()')
    })
    _.each(set.operator, function (operator) {
      it('translates object with ' + operator + ' operator', function () {
        assert.equal(set.query({id: _.object([[operator, [1, 2]]])}), '`id` = 1 ' + operator + ' 2')
      })
    })
    it('does not crash on empty object', function () {
      assert.equal(set.query({created: {}}), '`created` = \'[object Object]\'')
    })
  })
  describe('#transform', function () {
    var fruit = {id: 1, name: 'Apple'}
    it('transforms with number', function () {
      assert.equal(set.transform(2)(fruit).id, 2)
    })
    it('transforms with object', function () {
      assert.equal(set.transform({id: 3})(fruit).id, 3)
    })
    it('transforms with now', function () {
      assert.equal(set.transform({created: {now: true}})(fruit).created, (new Date(Date.now() - (new Date).getTimezoneOffset() * 60000)).toISOString().substring(0, 19).replace('T', ' '))
    })
    _.each(set.operator, function (operator) {
      it('transforms object with ' + operator + ' operator', function () {
        fruit.id = 1
        assert.equal(set.transform({id: _.object([[operator, [1, 2]]])})(fruit).id, eval('1 ' + operator + ' 2'))
      })
    })
    it('does not crash on empty object', function () {
      assert.deepEqual(set.transform({created: {}})(fruit).created, {})
    })
  })
})
