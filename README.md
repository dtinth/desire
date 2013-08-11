desire [![Build Status](https://travis-ci.org/dtinth/desire.png?branch=master)](https://travis-ci.org/dtinth/desire)
======

Dependency Injection Container in less than 50 lines of code.

`desire()` is to components as `require()` is to modules.

I'd think of __desire__ as a way of solving the dependency problem rather than calling it a library,
and that this library is a reference implementation of a __desire__ container; it contained no magic,
but small, straightforward code.

__desire__ is unlicensed. It's public domain. You can use it for anything you want.



Creating Components, Specifying Dependencies
---

To define a component that desires other components, create a
component factory.

```javascript
var App = function(desire) {

  var ui = desire('ui')
  var version = desire('version')

  return {
    run: function() {
      console.log('application version ' + version)
      ui.show()
      console.log('ui is visible')
    }
  }

}
```


Other components do the same:

```javascript
var UI = function(desire) {

  return {
    show: function() {
      console.log('display ui')
    }
  }

}
```


Put the Components Together
---

To put them all together, create a container, register the component factories,
and then call __desire("component name")__.

```javascript
var Desire = require('./.')
var desire = new Desire()

desire.register({
  app: App,
  ui: UI,
  version: Desire.value('1.0.0')
})

var app = desire('app')

app.run()
```



Manually Injecting Dependencies
---

You can manually inject dependencies too.

Because a component factory is just a function that desires other components,
we can create a `Desire()` and pass it to the factory ourselves.

```javascript
var FakeUI = function(desire) {

  return {
    show: function() {
      console.log('this is a fake ui')
    }
  }

}

var app2 = App(new Desire({ ui: FakeUI, version: Desire.value('mock') }))

app2.run()
```


Some Patterns
---

Above was all that __desire__ does. The rest is up to you.

In this section I will show you some usage patterns.



### Module as Component Factory

I usually write a module to represent a component.

In this example you will see the analogy between `require` and `desire`.

Use `require` to request another module, and use `desire` to request another
component.

```javascript
var It = require('it.js')

module.exports = function RoomService(desire) {
  var database = desire('database')
  return { ... }
}
```

Usage:

```javascript
desire.register({ rooms: require('./components/room_service') })
```


### Component Configuration

`desire` manages just the dependencies for you.
You have to manage configrations yourself...

One way to do it is make a "component factory factory".

```javascript
module.exports = function(config) {
  return function RoomService(desire) {
    var database = desire('database')
    return { ... }
  }
}
```

```javascript
desire.register({ rooms: require('./components/room_service')({ ... }) })
```


Another way is to use `Function.prototype.bind` to bing the configuration to `this`.

```
module.exports = function RoomService(desire) {
  var config = this
  var database = desire('database')
  return { ... }
}
```

```javascript
desire.register({ rooms: require('./components/room_service').bind({ ... }) })
```


Yet another way is to treat configuration as a dependency.

```
module.exports = function Database(desire) {
  var config = desire('database.config')
  return { ... }
}
```

```javascript
desire.register({
  'database': require('./components/database'),
  'database.config': Desire.value({ host: 'localhost', ...  })
})
```







