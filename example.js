


// app component factory
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

// ui component factory
var UI = function(desire) {

  return {
    show: function() {
      console.log('display ui')
    }
  }

}


// let's create a container
var Desire = require('./.')
var desire = new Desire()

// register it
desire.register({
  app: App,
  ui: UI,
  version: Desire.value('1.0.0')
})

// now ask for the app component, and run
var app = desire('app')
app.run()



// some fake ui component
var FakeUI = function(desire) {
  return {
    show: function() {
      console.log('this is a fake ui')
    }
  }
}

var app2 = App(new Desire({ ui: FakeUI, version: Desire.value('mock') }))
app2.run()











