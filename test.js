var
  _ = require('underscore'),
  moment = require('moment'),
  expect = require('expect.js'),
  set = require('./')

describe('#set', function () {
  describe('#query', function () {
    it('translates number', function () {
      expect(set.query(1)).to.be('`id` = 1')
    })
    it('translates object', function () {
      expect(set.query({id: 1, name: 'Adam'})).to.be("`id` = 1, `name` = 'Adam'")
    })
    it('translates object with now', function () {
      expect(set.query({created: {now: true}})).to.be('`created` = now()')
    })
    _.each(set.operator, function (operator) {
      it('translates object with ' + operator + ' operator', function () {
        expect(set.query({id: _.object([[operator, [1, 2]]])})).to.be('`id` = 1 ' + operator + ' 2')
      })
    })
    it('does not crash on empty object', function () {
      expect(set.query({created: {}})).to.be('`created` = \'[object Object]\'')
    })
  })
  describe('#transform', function () {
    var fruit = {id: 1, name: 'Apple'}
    it('transforms with number', function () {
      expect(set.transform(2)(fruit).id).to.be(2)
    })
    it('transforms with object', function () {
      expect(set.transform({id: 3})(fruit).id).to.be(3)
    })
    it('transforms with now', function () {
      expect(set.transform({created: {now: true}})(fruit).created).to.be(moment().format('YYYY-MM-DD HH:mm:ss'))
    })
    _.each(set.operator, function (operator) {
      it('transforms object with ' + operator + ' operator', function () {
        fruit.id = 1
        expect(set.transform({id: _.object([[operator, [1, 2]]])})(fruit).id).to.be(eval('1 ' + operator + ' 2'))
      })
    })
    it('does not crash on empty object', function () {
      expect(set.transform({created: {}})(fruit).created).to.eql({})
    })
  })
})
