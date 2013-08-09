


var App = function(desire) {

  var ui = desire('ui')

  return {
    run: function() {
      console.log('application starts')
      ui.show()
      console.log('ui is visible')
    }
  }

}

var UI = function(desire) {

  return {
    show: function() {
      console.log('display ui')
    }
  }

}

var Desire = require('./.')
var desire = new Desire()

desire.register({
  app: App,
  ui: UI
})

var app = desire('app')

app.run()




var fakeUi = { show: function() { console.log('fake ui') } }

var app2 = App(new Desire({ ui: Desire.value(fakeUi) }))

app2.run()












