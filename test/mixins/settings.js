"use strict"
const mixin = require('../../index');
const {expect} = require('chai');

describe('Settings ', function () {
  let Test;

  beforeEach(function () {
    Test = class extends mixin('settings') {
      constructor() {
        super();
      }
    }
  });
  afterEach(function () {
    Test = undefined;
  });

  it('Setter', function () {
    expect(Test.Setter('asas', function () {})).to.eql(Test);

    Test.Setter('foo', function (value) {
      return 'bar';
    });

    let t = new Test();

    t.Setter('bar', function () {
      return 'foo';
    });

    t.set('foo', 'blah');
    t.set('bar', 'blah');

    expect(t.get('foo')).to.equal('bar');
    expect(t.get('bar')).to.equal('foo');
  });

  it('Getter', function () {
    expect(Test.Setter('asas', function () {})).to.eql(Test);

    Test.Getter('name.full', function (settings) {
      return settings.name.first + ' ' + settings.name.last;
    });

    let t = new Test();

    t.Getter('foo', function () {
      return 'bar';
    });

    t.set('name', {
      first: 'john',
      last: 'doe'
    });

    expect(t.get('name.full')).to.equal('john doe');
    expect(t.get('foo')).to.equal('bar');
  });

  it('set', function () {
    expect(Test.set('')).to.equal(Test);

    Test.set('foo', 'bar');

    let t = new Test();

    t.set('bar', 'foo');

    expect(t.get('foo')).to.equal('bar');
    expect(t.get('bar')).to.equal('foo');
  });

  it('get', function () {
    Test.set('foo', 'bar');

    let t = new Test();

    t.set('bar', 'foo');

    expect(Test.get('foo')).to.equal('bar');
    expect(t.get('bar')).to.equal('foo');
    expect(t.get('')).to.be.an('object');
  });

  it('load', function () {
    Test.load({
      NODE_ENV: 'development',
      PORT: 3000,
    });

    expect(Test.get('PORT')).to.equal(3000);

    let t = new Test();

    t.load({
      PORT: 4000,
    });

    expect(t.get('PORT')).to.equal(4000);
    expect(t.get('NODE_ENV')).to.equal('development');
  });
});
