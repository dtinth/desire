
function Desire(initial) {

  var cache = {}
  var registry = {}

  function desire(name) {
    if (!cache[name]) {
      if (!registry[name]) throw new Error("Not registered: " + name)
      cache[name] = {}
      cache[name].value = registry[name](desire)
    }
    return cache[name].value
  }

  desire.register = function(object) {
    for (var i in object) {
      if (Object.prototype.hasOwnProperty.call(object, i)) {
        registry[i] = object[i]
      }
    }
  }

  desire.clone = function() {
    return new Desire(registry)
  }

  desire.registry = registry

  if (typeof initial === 'object' && initial) {
    desire.register(initial)
  }

  initial = null

  return desire

}

Desire.value = function(value) {
  return function(desire) { return value }
}

/*global define*/
if (typeof define === 'function' && define.amd) {
  define('desire', [ ], function() { return Desire })
}

if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = Desire
}

