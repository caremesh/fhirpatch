/* eslint-disable no-new-wrappers */
/* eslint-disable no-caller */
const _ = require('lodash');

module.exports = {
//   /**
//    * Recursively convert nested primitives in an object into their
//    * object equivalents
//    *
//    * @param {Object} obj the object to convert
//    *
//    * @return {Object} the converted object
//    */
//   wrap(obj) {
//     if (_.isArray(obj)) {
//       return _.map(obj, arguments.callee);
//     }

  //     if (_.isObject(obj)) {
  //       return _.mapValues(obj, arguments.callee);
  //     }

  //     if (_.isString(obj)) {
  //       return new String(obj);
  //     }

  //     if (_.isNumber(obj)) {
  //       return new Number(obj);
  //     }

  //     if (_.isBoolean(obj)) {
  //       return new Boolean(obj);
  //     }

  //     return obj;
  //   },

  //   /**
  //  * Recursively convert nested wrapper objects in an object into their
  //  * primitive equivalents
  //  *
  //  * @param {Object} obj the object to convert
  //  *
  //  * @return {Object} the converted object
  //  */
  //   unwrap(obj) {
  //     if (_.isString(obj)) {
  //       return obj.toString();
  //     }
  //     if (_.isNumber(obj)) {
  //       return obj.toNumber();
  //     }
  //     if (_.isBoolean(obj)) {
  //       return obj.toBoolean();
  //     }

  //     if (_.isArray(obj)) {
  //       return _.map(obj, arguments.callee);
  //     }

  //     if (_.isObject(obj)) {
  //       return _.mapValues(obj, arguments.callee);
  //     }

  //     return obj;
  //   },

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
    if (Object.is(curr, val) || (_.isString(val) || _.isNumber(val) || _.isBoolean(val)) && curr == val) {
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

