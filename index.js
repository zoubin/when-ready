var noop = function () {}

module.exports = Ready

function Ready() {
  if (!(this instanceof Ready)) {
    return new Ready()
  }

  this.pending = 0

  var self = this
  this.ready = new Promise(function (resolve, reject) {
    self.end = function (err) {
      self.ended = true
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    }
  })
}

Ready.prototype.then = function(onFulfilled, onRejected) {
  return this.tick().then(onFulfilled, onRejected)
}

Ready.prototype.catch = function(onRejected) {
  return this.tick().catch(onRejected)
}

Ready.prototype.tick = function() {
  if (this.ended) return this.ready

  if (this.pending === 0) this.end()

  return this.ready
}

Ready.prototype.delay = function(delay) {
  var resume = this.pause()

  if (typeof delay === 'number') {
    setTimeout(resume, delay)
  } else if (isPromise(delay)) {
    delay.then(resume.bind(null, null), resume)
  }

  return resume
}

Ready.prototype.pause = function() {
  if (this.ended) return noop

  this.pending++
  var self = this
  var resumed = 0
  return function resume(err) {
    if (resumed++) return
    if (--self.pending === 0) self.end(err)
  }
}

function isPromise(o) {
  return o && typeof o.then === 'function'
}

