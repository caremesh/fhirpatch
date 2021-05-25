/*
 * Copyright 2021, careMESH Inc.  Refer to LICENSE.md for licensing terms.
 */

/* eslint-disable max-len */
const _ = require('lodash');
const {Fhir} = require('fhir');
const Operation = require('./operation');

const fhir = new Fhir;

/**
 * Returns the format of the resource provided.
 *
 * @param {Object|string} resource
 *
 * @return {'json'|'xml'|'obj'}
 */
function resourceFormat(resource) {
  if (_.isObject(resource)) {
    return 'obj';
  };

  try {
    JSON.parse(resource);
    return 'json';
  } catch (error) {
    try {
      fhir.xmlToObj(resource);
      return 'xml';
    } catch (error) {
      throw new Error(
          `Unrecognized resource format or invalid resource: ${resource}`,
      );
    }
  }
}

/**
 * Given a resource in string or object formats, return it as an
 * object.
 *
 * @param {Object|String} resource in xml, json, or an object
 *
 * @return {Object} a FHIR object
 */
function normalizeResource(resource) {
  if (_.isObject(resource)) {
    return {...resource};
  };

  try {
    return JSON.parse(resource);
  } catch (error) {
    try {
      return fhir.xmlToObj(resource);
    } catch (error) {
      throw (error);
    }
  }
}


/**
 * process an operation from the FHIR paramters format
 * to a more usable format
 *
 * @param {Object} operation the operation to process
 *
 * @return {{type, path, name, value, index, source, destination}}
 */
function parseOperation(operation) {
  const result = Object
      .values(operation.parameter)
      .reduce(
          function(op, i) {
            switch (i.name) {
              case 'type':
                return Object.assign(op, {type: i.valueCode});
              case 'path':
                return Object.assign(op, {
                  path: i.valueString,
                });
              case 'name':
                return Object.assign(op, {name: i.valueString});
              case 'value':
                return Object.assign(op,
                    {
                      value: processValue(i),
                      valueType: processValueType(i),
                    });
              case 'index':
                return Object.assign(op, {index: i.valueInteger});
              case 'source':
                return Object.assign(op, {source: i.valueInteger});
              case 'destination':
                return Object.assign(op, {
                  destination: i.valueInteger});
              default:
                throw new Error(`Received unrecognized parameter: ${i}`);
            }
          },
          new Operation(),
      );
  result.validate();
  return result;
}

/**
 * Process a value and return it's canonoical (json) form
 *
 * @param {Object} value the node containing the value
 *
 * @return {any} the value
 */
function processValue(value) {
  if (value.parameter) {
    if (_.isArray(value.parameter)) {
      return _.reduce(value.parameter,
          (acc, i) => _.concat(
              acc,
              {[i.name]: processValue(i)},
          ),
          [],
      );
    } else if (_.isObject) {
      return _.mapvalues(value.paramter, processValue);
    } else {
      throw new Error(`Invalid diff: couldn't process value of type parameter with content ${value}`);
    }
  }
  if (value.valueBase64Binary) {
    if (!_.isString(value.valueBase64Binary)) {
      throw new Error(`Invalid value for type valueBase64Binary: ${value.valueBase64Binary}`);
    }
    return value.valueBase64Binary;
  }

  if (value.valueBoolean) {
    if (!_.isBoolean(value.valueBoolean)) {
      throw new Error(`Invalid value for type valueBoolean: ${value.valueBoolean}`);
    }
    return value.valueBoolean;
  }

  if (value.valueCanonical) {
    if (!_.isString(value.valueCanonical)) {
      throw new Error(`Invalid value for type valueCanonical: ${value.valueCanonical}`);
    }
    return value.valueCanonical;
  }

  if (value.valueCodeableConcept) {
    if (!_.isObject(value.valueCodeableConcept)) {
      throw new Error(`Invalid value for type valueCodeableConcept: ${value.valueCodeableConcept}`);
    }
    return value.valueCodeableConcept;
  }

  if (value.valueCode) {
    if (!_.isString(value.valueCode)) {
      throw new Error(`Invalid value for type valueCode: ${value.valueCode}`);
    }
    return value.valueCode;
  }

  if (value.valueDate) {
    if (!_.isString(value.valueDate)) {
      throw new Error(`Invalid value for type valueDate: ${value.valueDate}`);
    }
    return value.valueDate;
  }

  if (value.valueDateTime) {
    if (!_.isString(value.valueDateTime)) {
      throw new Error(`Invalid value for type valueDateTime: ${value.valueDateTime}`);
    }
    return value.valueDateTime;
  }

  if (value.valueDecimal) {
    if (!_.isString(value.valueDecimal)) {
      throw new Error(`Invalid value for type valueDecimal: ${value.valueDecimal}`);
    }
    return value.valueDecimal;
  }

  if (value.valueHumanName) {
    if (!_.isObject(value.valueHumanName)) {
      throw new Error(`Invalid value for type valueHumanName: ${value.valueHumanName}`);
    }
    return value.valueHumanName;
  }

  if (value.valueContactPoint) {
    if (!_.isObject(value.valueContactPoint)) {
      throw new Error(`Invalid value for type valueContactPoint: ${value.valueContactPoint}`);
    }
    return value.valueContactPoint;
  }

  if (value.valueId) {
    if (!_.isString(value.valueId)) {
      throw new Error(`Invalid value for type valueId: ${value.valueId}`);
    }
    return value.valueId;
  }

  if (value.valueInstant) {
    if (!_.isString(value.valueInstant)) {
      throw new Error(`Invalid value for type valueInstant: ${value.valueInstant}`);
    }
    return value.valueInstant;
  }

  if (value.valueInteger) {
    if (!_.isString(value.valueInteger)) {
      throw new Error(`Invalid value for type valueInteger: ${value.valueInteger}`);
    }
    return value.valueInteger;
  }

  if (value.valueMarkdown) {
    if (!_.isString(value.valueMarkdown)) {
      throw new Error(`Invalid value for type valueMarkdown: ${value.valueMarkdown}`);
    }
    return value.valueMarkdown;
  }

  if (value.valueOid) {
    if (!_.isString(value.valueOid)) {
      throw new Error(`Invalid value for type valueOid: ${value.valueOid}`);
    }
    return value.valueOid;
  }

  if (value.valuePositiveInt) {
    if (!_.isInteger(value.valuePositiveInt)) {
      throw new Error(`Invalid value for type valuePositiveInt: ${value.valuePositiveInt}`);
    }
    return value.valuePositiveInt;
  }

  if (value.valueString) {
    if (!_.isString(value.valueString)) {
      throw new Error(`Invalid value for type valueString: ${value.valueString}`);
    }
    return value.valueString;
  }

  if (value.valueTime) {
    if (!_.isString(value.valueTime)) {
      throw new Error(`Invalid value for type valueTime: ${value.valueTime}`);
    }
    return value.valueTime;
  }

  if (value.valueUnsignedInt) {
    if (!_.isInteger(value.valueUnsignedInt)) {
      throw new Error(`Invalid value for type valueUnsignedInt: ${value.valueUnsignedInt}`);
    }
    return value.valueUnsignedInt;
  }

  if (value.valueUri) {
    if (!_.isString(value.valueUri)) {
      throw new Error(`Invalid value for type valueUri: ${value.valueUri}`);
    }
    return value.valueUri;
  }

  if (value.valueUrl) {
    if (!_.isString(value.valueUrl)) {
      throw new Error(`Invalid value for type valueUrl: ${value.valueUrl}`);
    }
    return value.valueUrl;
  }

  if (value.valueUuid) {
    if (!_.isString(value.valueUuid)) {
      throw new Error(`Invalid value for type valueUuid: ${value.valueUuid}`);
    }
    return value.valueUuid;
  }

  if (value.valueIdentifier) {
    if (!_.isObject(value.valueIdentifier)) {
      throw new Error(`Invalid value for type valueIdentifier: ${value.valueIdentifier}`);
    }
    return value.valueIdentifier;
  }

  if (value.valueCodeableConcept) {
    if (!_.isObject(value.valueCodeableConcept)) {
      throw new Error(`Invalid value for type valueCodeableConcept: ${value.valueCodeableConcept}`);
    }
    return value.valueCodeableConcept;
  }

  throw new Error(`Unsupported value.  Got ${JSON.stringify(value)}.`);
}

/**
 * Process a value and return it's fhir type
 *
 * @param {Object} value the node containing the value
 *
 * @return {string} the value's type
 */
function processValueType(value) {
  const result = _.keys(value)
      .filter((i) => i.startsWith('value'));
  return _.get(result, '0', null);
}

/**
 * this function removes all empty collections (recursively) from a FHIR
 * object so that we comply with the FHIR spec which forbids empty containers
 * in JSON form.
 *
 * @param {Object} val the resource to cleanup
 * @return {Object}
 */
function cleanupResource(val) {
  let node = _.clone(val);

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
module.exports = {
  normalizeResource,
  processValue,
  parseOperation,
  resourceFormat,
  cleanupResource,
};
