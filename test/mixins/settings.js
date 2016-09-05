"use strict"

const assert = require('chai').assert;

const mixinUtil = require('../../index');

describe('settings', function () {
  let Test;

  beforeEach(function () {
    Test = class extends mixinUtil('settings') {
      constructor() {
        super();
      }
    }
  });

  afterEach(function () {
    Test = undefined;
  });

  it('settings can be mixied', function () {
    let t = new Test();

    assert.isTrue(!! t.set);
    assert.isTrue(!! t.get);
  });

  describe('methods', function () {
    it('set & get', function () {
      let t = new Test();

      t.set('test', 4);

      assert.equal(t.get('test'), 4);
    });

    it('deep set & get', function () {
      let t = new Test();

      t.set('a.b', 'this is b');
      t.set('a.a', 'this is a');

      assert.deepEqual(t.get('a'), {a: 'this is a', b: 'this is b'});
    });
  });

  describe('static', function () {

    it('ValidateSetting', function () {
      Test.ValidateSetting('test', function (val) {
        return typeof val == 'string';
      });

      let t = new Test();

      assert.throws(t.set.bind(t, 'test', 4));

      t.set('test', 'works');

      assert.equal(t.get('test'), 'works');
    });

    it('SettingDefault', function () {
      Test.SettingDefault('test', 'this is the default');

      let t = new Test();

      assert.equal(t.get('test'), 'this is the default');
    });

    it('SettingTransform', function () {
      Test.SettingTransform('test', function (val) {
        return val.toUpperCase();
      });

      let t = new Test();

      t.set('test', 'works');

      assert.equal(t.get('test'), 'WORKS');
    });
  });
});
