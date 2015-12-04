# when-ready
[![version](https://img.shields.io/npm/v/when-ready.svg)](https://www.npmjs.org/package/when-ready)
[![status](https://travis-ci.org/zoubin/when-ready.svg?branch=master)](https://travis-ci.org/zoubin/when-ready)
[![coverage](https://img.shields.io/coveralls/zoubin/when-ready.svg)](https://coveralls.io/github/zoubin/when-ready)
[![dependencies](https://david-dm.org/zoubin/when-ready.svg)](https://david-dm.org/zoubin/when-ready)
[![devDependencies](https://david-dm.org/zoubin/when-ready/dev-status.svg)](https://david-dm.org/zoubin/when-ready#info=devDependencies)

Sugar way to manage your pendings.

## Example

```javascript
var Ready = require('..')

function Concat() {
  this.ready = Ready()
}

Concat.prototype.add = function(file) {
  this['addType' + (rand() % 2 + 1)](file)
}

Concat.prototype.addType1 = function(file) {
  var self = this

  this.ready.delay(
    new Promise(function (resolve) {
      setTimeout(function() {
        self.push('{' + file.slice(-1) + '}')
        resolve()
      }, rand())
    })
  )
}

Concat.prototype.addType2 = function(file) {
  var cb = this.ready.delay()

  var self = this
  setTimeout(function() {
    self.push('[' + file.slice(-1) + ']')
    cb()
  }, rand())
}

Concat.prototype.push = function(source) {
  console.log(source.toUpperCase())
}

Concat.prototype.end = function() {
  var self = this
  this.ready.then(function () {
    self.push('\n# end #')
  })
}

function rand() {
  return Math.ceil(Math.random() * 100)
}

var concat = new Concat()

concat.add('./a')
concat.add('./b')
concat.add('./c')
concat.end()

// [B]
// {C}
// [A]
// 
// # END #


```

## class Ready()
Instances are `thenable` objects.

### .then(onFulfilled, onRejected)

### .catch(onRejected)

### .delay(n)

If `n` is `Number`, it specifies the amount of time to be delayed.

If `n` is `Promise`, it delays until the promise resolves or rejects.

Otherwise, it delays until the returned callback is called.

