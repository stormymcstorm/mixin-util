/**
 * Settings mixin
 */

/**
 * settings - a mixin for adding settings utility
 *
 * @param  {Function} parentClass the parentClass to extend.
 * @return {Function}             the extended class
 */
module.exports = function settings(parentClass) {

  let _ = require('private-properties')("Settings Private");

  /**
   * settings utility class
   * @class
   * @extends parentClass
   */
  class Settings extends parentClass {
    constructor() {
      super();
    }
  }

  // These Methods can have multiple contexts //

  /**
   * get - returns the value of the setting
   *
   * @param  {String|Number|Symbol} name the name of the setting
   * @return {this}      for chaining
   */
  function get(name) {
    let context = this instanceof Settings ? this : this.prototype;

    //NOTE: use clone so that settings aren't mutated

    if(name === '') return clone(_(context).settings);

    // use getter
    if(_(context).getters[name]) {
      // don't mutate
      return _(context).getters[name].call(context, clone(_(context).settings));
    }

    return fromPath(name, clone(_(context).settings));
  }

  /**
   * set - sets the value of a setting
   *
   * @param  {String|Number|Symbol} name  the name of the setting
   * @param  {*} value the value to set
   * @return {this}       for chaining
   */
  function set(name, value) {
    let context = this instanceof Settings ? this : this.prototype;

    // use setter
    if(_(context).setters[name]) {
      fromPath(name, _(context).settings, _(context).setters[name].call(context, value));
      return this;
    }

    fromPath(name, _(context).settings, value);

    return this;
  }

  /**
   * load - loads a object into settings
   *
   * @param  {Object} sets an object containing settings to merge with current
   * @return {this}     for chaining
   */
  function load(sets) {
    let context = this instanceof Settings ? this : this.prototype;
    let self = this;

    iterate(sets, function (path, val) {
      self.set(path, val);
    });

    return this;
  }

  /**
   * Setter - creates a setter for the setting. The setter function should
   * accept the value provieded by set and return the right value
   *
   * @static
   * @param  {String|Number|Symbol} name   the name of the setting
   * @param  {Function} setter the function used to set the value
   * @return {this}        for chaining
   */
  function Setter(name, setter) {
    let context = this instanceof Settings ? this : this.prototype;

    _(context).setters[name] = setter;

    return this;
  }

  /**
   * Getter - this adds a getter function for a setting. This function will
   * be passed the entire settings object
   *
   * @param  {String|Number|Symbol} name   the name of the setting
   * @param  {Function} getter the function that will return the value on get
   * @return {this}        for chaining
   */
  function Getter(name, getter) {
    let context = this instanceof Settings ? this : this.prototype;

    _(context).getters[name] = getter;

    return this;
  }

  // public
  Object.assign(Settings.prototype, {
    get,
    set,
    load,
    Setter,
    Getter,
  });

  Object.assign(Settings, {
    get,
    set,
    load,
    Setter,
    Getter,
  });

  // private
  Object.assign(_(Settings.prototype), {
    settings: {},
    setters: {},
    getters: {},
  });

  return Settings;
}


/**
 * clone - clones an object
 *
 * @private
 * @param  {Object} obj the object to clone
 * @return {Object}     the cloned object
 */
function clone(obj) {
  let copy = {};

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  for (let propname in obj) {
    if (obj.hasOwnProperty(propname)) {
      if(typeof obj[propname] == 'object') {
        copy[propname] = clone(obj[propname]);
        continue;
      }

      copy[propname] = obj[propname];
    }
  }

  return copy;
}

/**
 * iterte - iterates through a object deeply
 *
 * @private
 * @param  {Object} obj    the object to iterate through
 * @param  {Function} fn     the function that is called for ever primative property
 */
function iterate(obj, fn, pos=[]) {
  for (let propname in obj) {
    if (obj.hasOwnProperty(propname)) {
      let newPos = pos.slice()

      newPos.push(propname);

      if(typeof obj[propname] == 'object'){
        iterate(obj[propname], fn, newPos);
        continue;
      }


      fn(newPos.join('.'), obj[propname]);
    }
  }
}


/**
 * fromPath - finds value base on path
 *
 * @private
 * @param  {String} path the path to the property
 * @param  {Object} base the object to look in
 * @param  {*} [val]  the value to set at the property
 * @return {*}      the value of the property
 */
function fromPath(path, base, val) {
  return path.split('.').reduce(function (prev, current, i) {
    if(! prev) return;

    // for set
    if(val && ! prev[current]) prev[current] = {};

    // for last
    if(val && i === path.split('.').length - 1) prev[current] = val;

    return prev[current];
  }, base);
}
