/* eslint-disable no-new-wrappers */
const _ = require('lodash');

module.exports = {
  /**
   * Recursively convert nested primitives in an object into their
   * object equivalents
   *
   * @param {Object} obj the object to convert
   *
   * @return {Object} the converted object
   */
  wrap(obj) {
    if (_.isArray(obj)) {
      return _.map(obj, this.callee);
    }

    if (_.isObject(obj)) {
      return _.mapValues(obj, this.callee);
    }

    if (_.isString(obj)) {
      return new String(obj);
    }

    if (_.isNumber(obj)) {
      return new Number(obj);
    }

    if (_.isBoolean(obj)) {
      return new Boolean(obj);
    }

    return obj;
  },

  /**
 * Recursively convert nested wrapper objects in an object into their
 * primitive equivalents
 *
 * @param {Object} obj the object to convert
 *
 * @return {Object} the converted object
 */
  unwrap(obj) {
    switch (obj.constructor) {
      case 'String':
        return obj.toString();
      case 'Number':
        return obj.toNumber();
      case 'Boolean':
        return obj.toBoolean();
      default:
        if (_.isArray(obj)) {
          return _.map(obj, this.callee);
        }

        if (_.isObject(obj)) {
          return _.mapValues(obj, this.callee);
        }

        return obj;
    }
  },

  /**
 * Delete a nested object value from a resource by object id
 *
 * @param {any} curr the current node
 * @param {any} val the current value
 * @param {boolean} wrapped whether or not the value is wrapped
 *
 * @return {any} the updated node
 */
  deepDeleteValue(curr, val) {
    if (Object.is(curr, val)) {
      return undefined;
    }

    if (_.isArray(curr)) {
      return _.compact(_.map(curr, (i) => arguments.callee(i, val, true)));
    }

    if (_.isObject(curr)) {
      return _.omitBy(_.mapValues(curr, (i) => arguments.callee(i, val, true)), _.isUndefined);
    }

    return curr;
  },
};

