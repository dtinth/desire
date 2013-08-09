desire
======

Dependency Injection Container in less than 50 lines of code.

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

---

To run, create a container, register components, and desire.

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








