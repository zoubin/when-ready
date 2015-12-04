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

