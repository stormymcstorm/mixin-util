"use strict"
/**
 * Mixin utility module
 * @module mixin-util
 */

exports = module.exports = mixin;

/**
 * Used to determine if a class used mixins and what ones
 * @class
 */
class Mixed {
  constructor() {}
}

exports.Mixed = Mixed;

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
  return mixins.reduce(function (prevMxn, currentMxn) {
    if(typeof currentMxn == 'string') {
      if(! mixin[currentMxn]) throw new Error(`${currentMxn} does not exsit`);
      currentMxn = mixin[currentMxn];
    }

    return currentMxn(prevMxn);
  }, Mixed);
}

// mixins
exports.settings = require('./mixins/settings');
exports.middleware = require('./mixins/middleware');
