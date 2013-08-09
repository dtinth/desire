
/*global describe, it, beforeEach*/
var Desire = require('..')
var expect = require('chai').expect

describe('Desire', function() {

  it('should return a registered component', function() {

    var desire = new Desire()

    desire.register({
      test: function(desire) {
        return { ok: true }
      }
    })

    expect(desire('test').ok).to.equal(true)

  })

  it('should let a component desire another component', function() {

    var desire = new Desire()

    desire.register({
      app: function(desire) {
        return { ui: desire('ui') }
      },
      ui: function(desire) {
        return { name: 'ui' }
      }
    })

    expect(desire('app').ui.name).to.equal('ui')

  })

  it('should register when passed to constructor', function() {

    var App = function(desire) {
      return { ui: desire('ui') }
    }

    var desire = new Desire({
      ui: function(desire) {
        return { name: 'ui' }
      }
    })

    expect(App(desire).ui.name).to.equal('ui')

  })
  
})













