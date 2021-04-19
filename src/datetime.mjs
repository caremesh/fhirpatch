import {FP_DateTime} from './types.mjs';
import constants from './constants.mjs';

const engine = {};
/**
 *  Implements FHIRPath now().
 */
engine.now = function() {
  if (!constants.now) {
    // return new FP_DateTime((new Date()).toISOString());
    // The above would construct an FP_DateTime with a timezone of "Z", which
    // would not make a difference for computation, but if the end result of an
    // expression is "now()", then it would look different when output to a user.
    // Construct it ourselves to preserve timezone
    const now = constants.nowDate; // a JS Date
    const isoStr = FP_DateTime.isoDateTime(now);
    constants.now = new FP_DateTime(isoStr);
  }
  return constants.now;
};


/**
 *  Implements FHIRPath today().  See comments in now(). This does not
 *  include a timezone offset.
 */
engine.today = function() {
  if (!constants.today) {
    // Construct the string ourselves to preserve timezone
    const now = constants.nowDate; // a JS Date
    const isoStr = FP_DateTime.isoDate(now);
    constants.today = new FP_DateTime(isoStr);
  }
  return constants.today;
};

export default engine;
