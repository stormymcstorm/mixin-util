/**
 * Middleware mixin
 * @alias mixinUtil.Middleware
 */

/**
 * middleware - a mixin for middleware utility
 *
 * @param {Function} parentClass the parent class to extended.
 * @return {Function} the extended class
 */
module.exports = function middleware(parentClass) {
  // private
  let _stack = Symbol("stack");

  /**
   * middleware utility class
   * @class
   * @extends parentClass
   */
  class Middleware extends parentClass{
    constructor() {
      super();
      this[_stack] = [];
    }


    /**
     * use - adds middleware to stack
     *
     * @param  {Function(S)|Array(s)} ...fns arrays will be flatten
     * so that each function is called in order.
     * @return {this}        for chaining
     */
    use(...fns) {
      fns = flatten(fns);

      this[_stack].push(...fns);

      return this;
    }



    /**
     * handle - handles middleware stack
     *
     * @param  {*} ...args arguments to pass to the middleware
     * @return {this}        for chaining
     */
    handle(...args) {
      let stack = this[_stack];
      let errHandler;
      let self = this;

      // look for a error handler
      for (let i = 0; i < stack.length; i++) {
        if(stack[i].length >= args.length + 2) errHandler = stack.splice(i, 1);
      }

      function next(nextInStack, err) {
        if(err) {
          if(! errHandler) {
            throw err;
          }

          errHandler(err, ...args);
          return;
        }

        if(nextInStack) nextInStack();
      }

      // build call chain
      let call = stack.slice(0).reverse().reduce((prev, current, i) => {
        if(i == 1) prev = prev.bind(self, ...args, function () {});

        return current.bind(self, ...args, next.bind(null, prev));
      });

      call();

      return this;
    }
  }

  return Middleware;
}


function flatten(array, result=[]) {
  for (let i = 0; i < array.length; i++) {
    let val = array[i];

    if(Array.isArray(val)){
      flatten(val, result);
      continue;
    }

    result.push(val);
  }

  return result;
}
