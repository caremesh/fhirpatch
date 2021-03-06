/*
 * Copyright 2021, careMESH Inc.  Refer to LICENSE.md for licensing terms.
 */

/* eslint-disable max-len */
const _ = require('lodash');
const { Fhir } = require('fhir');
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
    return { ...resource };
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
      function (op, i) {
        switch (i.name) {
          case 'type':
            return Object.assign(op, { type: i.valueCode });
          case 'path':
            return Object.assign(op, {
              path: i.valueString,
            });
          case 'name':
            return Object.assign(op, { name: i.valueString });
          case 'value':
            return Object.assign(op,
              {
                value: processValue(i),
                valueType: processValueType(i),
              });
          case 'index':
            return Object.assign(op, { index: i.valueInteger });
          case 'source':
            return Object.assign(op, { source: i.valueInteger });
          case 'destination':
            return Object.assign(op, {
              destination: i.valueInteger,
            });
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
          { [i.name]: processValue(i) },
        ),
        [],
      );
    } else if (_.isObject) {
      return _.mapvalues(value.paramter, processValue);
    } else {
      throw new Error(`Invalid diff: couldn't process value of type parameter with content ${value}`);
    }
  }

  if (_.has(value, 'valueAddress')) {
    if (!_.isObject(value.valueAddress)) {
      throw new Error(`Invalid value for type valueAddress: ${value.valueAddress}`);
    }
    return value.valueAddress;
  }

  if (_.has(value, 'valueBase64Binary')) {
    if (!_.isString(value.valueBase64Binary)) {
      throw new Error(`Invalid value for type valueBase64Binary: ${value.valueBase64Binary}`);
    }
    return value.valueBase64Binary;
  }

  if (_.has(value, 'valueBoolean')) {
    if (!_.isBoolean(value.valueBoolean)) {
      throw new Error(`Invalid value for type valueBoolean: ${value.valueBoolean}`);
    }
    return value.valueBoolean;
  }

  if (_.has(value, 'valueCanonical')) {
    if (!_.isString(value.valueCanonical)) {
      throw new Error(`Invalid value for type valueCanonical: ${value.valueCanonical}`);
    }
    return value.valueCanonical;
  }

  if (_.has(value, 'valueCodeableConcept')) {
    if (!_.isObject(value.valueCodeableConcept)) {
      throw new Error(`Invalid value for type valueCodeableConcept: ${value.valueCodeableConcept}`);
    }
    return value.valueCodeableConcept;
  }

  if (_.has(value, 'valueCoding')) {
    if (!_.isObject(value.valueCoding)) {
      throw new Error(`Invalid value for type valueCoding: ${value.valueCoding}`);
    }
    return value.valueCoding;
  }

  if (_.has(value, 'valueCode')) {
    if (!_.isString(value.valueCode)) {
      throw new Error(`Invalid value for type valueCode: ${value.valueCode}`);
    }
    return value.valueCode;
  }

  if (_.has(value, 'valueDate')) {
    if (!_.isString(value.valueDate)) {
      throw new Error(`Invalid value for type valueDate: ${value.valueDate}`);
    }
    return value.valueDate;
  }

  if (_.has(value, 'valueDateTime')) {
    if (!_.isString(value.valueDateTime)) {
      throw new Error(`Invalid value for type valueDateTime: ${value.valueDateTime}`);
    }
    return value.valueDateTime;
  }

  if (_.has(value, 'valueDecimal')) {
    if (!_.isString(value.valueDecimal)) {
      throw new Error(`Invalid value for type valueDecimal: ${value.valueDecimal}`);
    }
    return value.valueDecimal;
  }

  if (_.has(value, 'valueHumanName')) {
    if (!_.isObject(value.valueHumanName)) {
      throw new Error(`Invalid value for type valueHumanName: ${value.valueHumanName}`);
    }
    return value.valueHumanName;
  }

  if (_.has(value, 'valueContactPoint')) {
    if (!_.isObject(value.valueContactPoint)) {
      throw new Error(`Invalid value for type valueContactPoint: ${value.valueContactPoint}`);
    }
    return value.valueContactPoint;
  }

  if (_.has(value, 'valueId')) {
    if (!_.isString(value.valueId)) {
      throw new Error(`Invalid value for type valueId: ${value.valueId}`);
    }
    return value.valueId;
  }

  if (_.has(value, 'valueInstant')) {
    if (!_.isString(value.valueInstant)) {
      throw new Error(`Invalid value for type valueInstant: ${value.valueInstant}`);
    }
    return value.valueInstant;
  }

  if (_.has(value, 'valueInteger')) {
    if (!_.isString(value.valueInteger)) {
      throw new Error(`Invalid value for type valueInteger: ${value.valueInteger}`);
    }
    return value.valueInteger;
  }

  if (_.has(value, 'valueMarkdown')) {
    if (!_.isString(value.valueMarkdown)) {
      throw new Error(`Invalid value for type valueMarkdown: ${value.valueMarkdown}`);
    }
    return value.valueMarkdown;
  }

  if (_.has(value, 'valueOid')) {
    if (!_.isString(value.valueOid)) {
      throw new Error(`Invalid value for type valueOid: ${value.valueOid}`);
    }
    return value.valueOid;
  }

  if (_.has(value, 'valuePositiveInt')) {
    if (!_.isInteger(value.valuePositiveInt)) {
      throw new Error(`Invalid value for type valuePositiveInt: ${value.valuePositiveInt}`);
    }
    return value.valuePositiveInt;
  }

  if (_.has(value, 'valueString')) {
    if (!_.isString(value.valueString)) {
      throw new Error(`Invalid value for type valueString: ${value.valueString}`);
    }
    return value.valueString;
  }

  if (_.has(value, 'valueTime')) {
    if (!_.isString(value.valueTime)) {
      throw new Error(`Invalid value for type valueTime: ${value.valueTime}`);
    }
    return value.valueTime;
  }

  if (_.has(value, 'valueUnsignedInt')) {
    if (!_.isInteger(value.valueUnsignedInt)) {
      throw new Error(`Invalid value for type valueUnsignedInt: ${value.valueUnsignedInt}`);
    }
    return value.valueUnsignedInt;
  }

  if (_.has(value, 'valueUri')) {
    if (!_.isString(value.valueUri)) {
      throw new Error(`Invalid value for type valueUri: ${value.valueUri}`);
    }
    return value.valueUri;
  }

  if (_.has(value, 'valueUrl')) {
    if (!_.isString(value.valueUrl)) {
      throw new Error(`Invalid value for type valueUrl: ${value.valueUrl}`);
    }
    return value.valueUrl;
  }

  if (_.has(value, 'valueUuid')) {
    if (!_.isString(value.valueUuid)) {
      throw new Error(`Invalid value for type valueUuid: ${value.valueUuid}`);
    }
    return value.valueUuid;
  }

  if (_.has(value, 'valueIdentifier')) {
    if (!_.isObject(value.valueIdentifier)) {
      throw new Error(`Invalid value for type valueIdentifier: ${value.valueIdentifier}`);
    }
    return value.valueIdentifier;
  }

  if (_.has(value, 'valueCodeableConcept')) {
    if (!_.isObject(value.valueCodeableConcept)) {
      throw new Error(`Invalid value for type valueCodeableConcept: ${value.valueCodeableConcept}`);
    }
    return value.valueCodeableConcept;
  }

  if (_.has(value, 'valueReference')) {
    if (!_.isObject(value.valueReference)) {
      throw new Error(`Invalid value for type valueReference: ${value.valueReference}`);
    }
    return value.valueReference;
  }

  if (_.has(value, 'valueMeta')) {
    if (!_.isObject(value.valueMeta)) {
      throw new Error(`Invalid value for type valueMeta: ${value.valueMeta}`);
    }
    return value.valueMeta;
  }

  if (_.has(value, 'valueDosage')) {
    if (!_.isObject(value.valueDosage)) {
      throw new Error(`Invalid value for type valueDosage: ${value.valueDosage}`);
    }
    return value.valueDosage;
  }

  if (_.has(value, 'valueBackboneElement')) {
    if (!_.isObject(value.valueBackboneElement)) {
      throw new Error(`Invalid value for type valueBackboneElement: ${value.valueBackboneElement}`);
    }
    return value.valueBackboneElement;
  }

  if (_.has(value, 'valueNarrative')) {
    if (!_.isObject(value.valueNarrative)) {
      throw new Error(`Invalid value for type valueNarrative: ${value.valueNarrative}`);
    }
    return value.valueNarrative;
  }

  if (_.has(value, 'valueExtension')) {
    if (!_.isArray(value.valueExtension) && !_.isObject(value.valueExtension)) {
      throw new Error(`Invalid value for type valueExtension: ${value.valueExtension}`);
    }
    return value.valueExtension;
  }

  if (_.has(value, 'valueElementDefinition')) {
    if (!_.isObject(value.valueElementDefinition)) {
      throw new Error(`Invalid value for type valueElementDefinition: ${value.valueElementDefinition}`);
    }
    return value.valueElementDefinition;
  }

  if (_.has(value, 'valueContactDetail')) {
    if (!_.isObject(value.valueContactDetail)) {
      throw new Error(`Invalid value for type valueContactDetail: ${value.valueContactDetail}`);
    }
    return value.valueContactDetail;
  }

  if (_.has(value, 'valueContributor')) {
    if (!_.isObject(value.valueContributor)) {
      throw new Error(`Invalid value for type valueContributor: ${value.valueContributor}`);
    }
    return value.valueContributor;
  }

  if (_.has(value, 'valueDataRequirement')) {
    if (!_.isObject(value.valueDataRequirement)) {
      throw new Error(`Invalid value for type valueDataRequirement: ${value.valueDataRequirement}`);
    }
    return value.valueDataRequirement;
  }

  if (_.has(value, 'valueRelatedArtifact')) {
    if (!_.isObject(value.valueRelatedArtifact)) {
      throw new Error(`Invalid value for type valueRelatedArtifact: ${value.valueRelatedArtifact}`);
    }
    return value.valueRelatedArtifact;
  }

  if (_.has(value, 'valueUsageContext')) {
    if (!_.isObject(value.valueUsageContext)) {
      throw new Error(`Invalid value for type valueUsageContext: ${value.valueUsageContext}`);
    }
    return value.valueUsageContext;
  }

  if (_.has(value, 'valueParameterDefinition')) {
    if (!_.isObject(value.valueParameterDefinition)) {
      throw new Error(`Invalid value for type valueParameterDefinition: ${value.valueParameterDefinition}`);
    }
    return value.valueParameterDefinition;
  }

  if (_.has(value, 'valueExpression')) {
    if (!_.isObject(value.valueExpression)) {
      throw new Error(`Invalid value for type valueExpression: ${value.valueExpression}`);
    }
    return value.valueExpression;
  }

  if (_.has(value, 'valueTriggerDefinition')) {
    if (!_.isObject(value.valueTriggerDefinition)) {
      throw new Error(`Invalid value for type valueTriggerDefinition: ${value.valueTriggerDefinition}`);
    }
    return value.valueTriggerDefinition;
  }

  if (_.has(value, 'valueAttachment')) {
    if (!_.isObject(value.valueAttachment)) {
      throw new Error(`Invalid value for type valueAttachment: ${value.valueAttachment}`);
    }
    return value.valueAttachment;
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
