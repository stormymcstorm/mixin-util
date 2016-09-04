/**
 * Settings mixin
 * @alias mixinUtil.settings
 */


/**
 * settings - a mixin for adding settings utility
 *
 * @param  {Function} parentClass the parentClass to extend.
 * @return {Function}             the extended class
 */
module.exports = function settings(parentClass) {

  // private
  let _settings = Symbol("settings");
  let _settingValidators = Symbol("setting validators");
  let _settingTransformers = Symbol("setting transformers");

  /**
   * settings utility class
   * @class
   * @extends parentClass
   */
  class Settings extends parentClass {
    constructor() {
      super();
    }


    /**
     * returns value of setting
     *
     * @param {String} name the name of the setting
     * @return {*}  the value of the setting
     */
    get(name) {
      return this[_settings][name];
    }


    /**
     * sets value of setting
     *
     * @param {String} name the name of the setting
     * @param {*} value the value for the setting
     * @return {this}  for chaining
     * @throws will throw if value provided failes validator
     */
    set(name, value) {
      // check for validators
      if(this[_settingValidators][name]
        && ! this[_settingValidators][name](value)) {
        throw new Error(`Value: ${value} failed validator for ${name} setting`);
      }

      // check for transformer
      if(this[_settingTransformers][name]) {
        this[_settings][name] = this[_settingTransformers][name](value);
        return this;
      }

      this[_settings][name] = value;

      return this;
    }


    /**
     * adds validator to setting
     *
     * @param  {String} name      the name of the setting
     * @param  {Function} validator description
     * @return {this}           for chaining
     */
    static ValidateSetting(name, validator) {
      this.prototype[_settingValidators][name] = validator;

      return this;
    }



    /**
     * sets default value for setting
     *
     * @param  {String} name  the name of the setting
     * @param  {*} value the value for the setting
     * @return {this}       for chaining
     */
    static SettingDefault(name, value) {
      this.prototype[_settings][name] = value;

      return this;
    }

    static SettingTransform(name, transformer) {
      this.prototype[_settingTransformers][name] = transformer;

      return this;
    }
  }

  // prototype
  Settings.prototype[_settings] = {};
  Settings.prototype[_settingValidators] = {};
  Settings.prototype[_settingTransformers] = {};

  return Settings;
}
