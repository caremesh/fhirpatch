// This file holds code to hande the FHIRPath Combining functions.
import existence from './existence.mjs';

const combineFns = {};

combineFns.union = function(coll1, coll2) {
  return existence.distinctFn(coll1.concat(coll2));
};

combineFns.combineFn = function(coll1, coll2) {
  return coll1.concat(coll2);
};


export default combineFns;
