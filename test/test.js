"use strict"

const assert = require('chai').assert;

const mixinUtil = require('../index');

it('mixinUtil', function () {
  class Test extends mixinUtil('settings') {
    constructor() {
      super();
    }
  }

  let t = new Test();

  assert.isTrue(!! t._settings);
});
