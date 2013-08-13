
/*global describe, it, beforeEach, context*/
var Desire = require('..')
var expect = require('chai').expect

describe('Desire', function() {

  context('with one component', function() {

    var desire

    beforeEach(function() {
      desire = new Desire()
      desire.register({
        test: function(desire) {
          return { ok: true }
        }
      })
    })

    it('should return a registered component', function() {
      expect(desire('test').ok).to.equal(true)
    })

    it('should return the same component', function() {
      expect(desire('test')).to.equal(desire('test'))
    })
    
  })

  context('with several components', function() {

    var desire

    beforeEach(function() {
      desire = new Desire({
        a: function(desire) {
          return { a: true }
        },
        b: function(desire) {
          return { b: true }
        },
        c: function(desire) {
          return { a: desire('a') }
        }
      })
    })

    it('should return a correct component', function() {
      expect(desire('a').a).to.equal(true)
      expect(desire('b').b).to.equal(true)
    })

    it('should let a component desire another component', function() {
      expect(desire('c').a.a).to.equal(true)
    })

    it('#clone should return a clone of the desire', function() {
      var desire2 = desire.clone()
      expect(desire2('a').a).to.equal(true)
      expect(desire2('b').b).to.equal(true)
    })

    it('#clone should return different object', function() {
      var desire2 = desire.clone()
      expect(desire2('a')).not.to.equal(desire('a'))
      expect(desire2('b')).not.to.equal(desire('b'))
    })

    it('#clone should return different object even cached', function() {
      var a = desire('a')
      var desire2 = desire.clone()
      expect(desire2('a')).not.to.equal(a)
      expect(desire2('b')).not.to.equal(desire('b'))
    })

    context('and another container with parent', function() {
      
      var childComponents = {
        d: function(desire) {
          return { c: desire('c') }
        }
      }

      it('should be able to find components in parent', function() {
        var child = new Desire(desire)
        expect(child('a')).to.equal(desire('a'))
      })

      it('should be able to find components in child', function() {
        var child = new Desire(desire)
        child.register(childComponents)
        expect(child('d').c).to.equal(desire('c'))
      })

      it('should be able to find components in child, also when created with constructor', function() {
        var child = new Desire(desire, childComponents)
        expect(child('d').c).to.equal(desire('c'))
      })

      it('but the parent should not see the child', function() {
        var child = new Desire(desire, childComponents)
        desire.register({
          test: function(desire) {
            desire('d')
          }
        })
        expect(function() { desire('test') }).to.throw(Error)
      })
      
    })
    
  })


  
})













