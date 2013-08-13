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

`desire.register(object)`
---
`desire.register(object)` takes an object and adds each property to
the container's __registry__.

The property's name is the component's name and the property's value is the
component factory function (see above examples).


`desire(componentName)`
---
`desire(componentName)` will look up a component given by `componentName`
in the container's __cache__.
If the component is not in the cache,
the component factory will be invoked,
and the returned component will be put into the container's __cache__.

An error is thrown when the component factory with the requested
name is not in the __registry__.

Again, see the above examples, or read the source code.


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


`desire.clone()`
---

You can call `desire.clone()` to create a copy of the container.

Only the __registry__ will be copied. The __cache__ will not be copied.


Child Containers
---

Sometimes you want to have a component that have sub-components, but you want
them to be isolated from the rest of the world.

That's when you can create a child container.

```javascript
var child = new Desire(parent)
```

It behaves like normal containers,
but when you look up a component that's not in the child's registry,
it will look up in the parent's registry too.




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







