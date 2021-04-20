const _ = require('lodash');

/* this function removes all empty collections (recursively) from a FHIR object so that
 * we comply with the FHIR spec.
 */
function cleanupResource(val) {
  var node = _.clone(val);

  if (_.isBoolean(node) || _.isNull(node) || _.isNumber(node)) {
    return node;
  }

  if (_.isArray(node)) {
    node = _.map(node, (i) => cleanupResource(i));
  } else if (_.isObject(node)) {
    node = _.mapValues(node, (i) => cleanupResource(i));
    node = _.pickBy(node, (i) => (
      (i) === false || !!i
    ));
  }

  if (_.isEmpty(node) && (node !== false)) {
    return undefined;
  }


  return node;
}

module.exports = cleanupResource;
