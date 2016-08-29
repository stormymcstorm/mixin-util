/**
 * Mixin utility module
 * @module mixin-util
 */

exports = module.exports = mixin;


/**
 * mixin - Adds all of the mixins to a new class to be extended
 *
 * @example
 * // adds settings utility to class
 * class Test extends mixinUtil('settings'){
 *    constructor(){
 *      // super must be called for the mixins to work
 *      super();
 *    }
 * }
 * @param  {Function(s)|String(s)} ...mixins a list of mixins, these can be
 * mixins already provided or your own.
 * @return {Function}           a class containing all of the mixins
 */
function mixin(...mixins) {
  return mixins.reduce(function (Mixins, nextMixin) {
    if(typeof nextMixin == 'string') {
      nextMixin = mixin[nextMixin];
    }

    return nextMixin(Mixins);
  }, class Mixied{});
}

exports.settings = require('./mixins/settings');
