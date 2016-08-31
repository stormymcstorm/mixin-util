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
        if(stack[i].length >= args.length + 2) [errHandler] = stack.splice(i, 1);
      }

      // build call chain
      let call = stack.reverse().reduce((prev, current, i) => {
        return function next(err){
          if(err) {
            if(! errHandler)throw err;

            errHandler.call(self, err, ...args, function () {});
          }
          else {
            current.call(self, ...args, prev);
          }
        }
      }, function next(err) {
        if(err) {
          if(! errHandler)throw err;

          errHandler.call(self, err, ...args);
        }
      });

      // clean stack for later use
      stack.reverse();
      if(errHandler) stack.push(errHandler);

      call();

      return this;
    }
  }

  return Middleware;
}



/**
 * flatten - flattens array
 *
 * @param  {Array} array     the array to flatten
 * @param  {Array} [result=[]] used to run recursivly
 * @return {Array} the flatten array
 */
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
