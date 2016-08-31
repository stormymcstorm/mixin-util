"use strict";

const assert = require('chai').assert;

const mixinUtil = require('../../index');

describe('middleware', function () {
  let Test;

  beforeEach(function () {
    Test = class extends mixinUtil('middleware') {
      constructor() {
        super();
      }
    }
  });

  afterEach(function () {
    Test = undefined;
  });

  it('middleware can be mixed', function () {
    let t = new Test();

    assert.isTrue(!! t.use);
    assert.isTrue(!! t.handle);
  });

  describe('use & handle', function () {
    it('throws', function () {
      let t = new Test();

      t.use(function (next) {
        throw new Error("testing");
      });

      assert.throws(t.handle.bind(t));
    });
    it('error handler', function () {
      let t = new Test();

      t.use(function ({called}, next) {
        called++;
        next();
      });

      t.use(function handler(err, {called}, next) {
        assert.equal(err.status, 407);
        assert.equal(called, 2);
      });

      t.use(function ({called}, next) {
        called++;

        let err = new Error('test');
        err.status = 407;

        next(err);
      });

      t.handle({called: 0});
    });
    it('basic', function () {
      let t = new Test();
      let a = {i: 0};

      t.use([function one(b, next) {
        b.i++;

        next();
      }, function two(b, next) {
        b.i++;

        next();
      }], function three(b, next) {
        b.i++;

        next();
      });

      t.handle(a);

      assert.equal(a.i, 3);
    });
  });
});
