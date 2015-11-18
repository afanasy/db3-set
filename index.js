var
  _ = require('underscore'),
  moment = require('moment'),
  sqlString = require('sqlstring')

var app = module.exports = {
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators
  operator: ['+', '-', '*', '/', '%', '<<', '>>', '>>>', '&', '^', '|'],
  set: function (operator, y) {
    if (operator == '+')
      return function (x) {return x + y}
    if (operator == '-')
      return function (x) {return x - y}
    if (operator == '*')
      return function (x) {return x * y}
    if (operator == '/')
      return function (x) {return x / y}
    if (operator == '%')
      return function (x) {return x % y}
    if (operator == '<<')
      return function (x) {return x << y}
    if (operator == '>>')
      return function (x) {return x >> y}
    if (operator == '>>>')
      return function (x) {return x >>> y}
    if (operator == '&')
      return function (x) {return x & y}
    if (operator == '^')
      return function (x) {return x ^ y}
    if (operator == '|')
      return function (x) {return x | y}
    return _.identity
  },
  query: function (d) {
    if (_.isNumber(d) || _.isString(d))
      d = {id: +d}
    return _.map(d, function (value, key) {
      if (_.isObject(value) && _.size(value)) {
        var func = _.keys(value)[0]
        var args = _.values(value)[0]
        if (func == 'now')
          return sqlString.format('?? = now()', key)
        if (_.contains(app.operator, func))
          return sqlString.format('?? = ? ' + func + ' ?', [key, args[0], args[1]])
        if (_.contains(app.operator, func[0]) && (func[1] == '='))
          return sqlString.format('?? = ?? ' + func + ' ?', [key, key, args])
      }
      if ((key == 'id') && (value === false))
        return sqlString.format('?? = last_insert_id(??)', [key, key])
      return sqlString.format('?', _.object([[key, value]]))
    }).join(', ')
  },
  transform: function (d) {
    if (_.isNumber(d) || _.isString(d))
      d = {id: +d}
    return function (a) {
      _.each(d, function (value, key) {
        if (_.isObject(value) && _.size(value)) {
          var func = _.keys(value)[0]
          var args = _.values(value)[0]
          if (func == 'now')
            return a[key] = moment().format('YYYY-MM-DD HH:mm:ss')
          if (_.contains(app.operator, func))
            return a[key] = app.set(func, args[1])(args[0])
          if (_.contains(app.operator, func[0]) && (func[1] == '='))
            return a[key] = app.set(func, args)(a[key])
        }
        a[key] = value
      })
      return a
    }
  }
}
