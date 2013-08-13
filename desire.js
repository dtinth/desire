

var Desire = (function() {

  var has = Object.prototype.hasOwnProperty

  function Desire(parent, initial) {

    if (typeof parent !== 'function' && !initial) {
      initial = parent
      parent = noParent
    }

    var cache = {}
    var registry = {}

    function desire(name) {
      if (!cache[name]) {
        if (!registry[name]) return parent(name)
        cache[name] = {}
        cache[name].value = registry[name](desire)
      }
      return cache[name].value
    }

    desire.register = function(object) {
      copy(registry, object)
      return this
    }

    desire.clone = function() {
      return new Desire(parent, registry)
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

  function copy(dest, source) {
    for (var i in source) {
      if (has.call(source, i)) dest[i] = source[i]
    }
    return dest
  }

  function noParent(name) {
    throw new Error("Component not registered: " + name)
  }

  return Desire

})()

/*global define*/
if (typeof define === 'function' && define.amd) {
  define('desire', [ ], function() { return Desire })
}

if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = Desire
}

