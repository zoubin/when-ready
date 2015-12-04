var test = require('tap').test
var Ready = require('..')

test('delay', function(t) {
  t.plan(1)

  var ready = Ready()

  var q = []

  ready.delay(10)

  setTimeout(function() {
    q.push(1)
  }, 10)

  setTimeout(function() {
    q.push(4)
  }, 40)

  ready.delay(new Promise(function (resolve) {
    setTimeout(function() {
      q.push(2)
      resolve()
    }, 20)
  }))

  var resume = ready.delay()

  setTimeout(function() {
    q.push(3)
    resume()
  }, 30)


  ready.then(function () {
    t.same(q, [1, 2, 3])
  })
})

test('reject', function(t) {
  t.plan(3)

  var ready = Ready()

  ready.delay(new Promise(function (_, reject) {
    setTimeout(function() {
      reject(2)
    }, 20)
  }))

  ready.then(function () {
    t.ok(false)
  }, function (err) {
    t.equal(err, 2)
  })
  .then(function () {
    ready.catch(function (err) {
      t.equal(err, 2)
    })
  })
  ready.catch(function (err) {
    t.equal(err, 2)
  })
})

test('delay after ended', function(t) {
  t.plan(1)

  var ready = Ready()

  ready.then(function () {
    setTimeout(function() {
      var resume = ready.delay(new Promise(function () {}))
      resume()
      ready.then(function () {
        t.ok(true)
      })
    }, 10)
  })

})

test('increasing delays', function(t) {
  t.plan(1)

  var ready = Ready()

  var count = 0

  ;(function increase() {
    var resume = ready.delay()
    setTimeout(function() {
      if (count++ < 5) {
        increase()
      }
      resume()
    }, 10)
  })()

  ready.then(function () {
    t.equal(count, 6)
  })

})

