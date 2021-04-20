import _ from 'lodash';
import {Fhir} from 'fhir';
import Operation from './operation.mjs';

const fhir = new Fhir;

/**
 * Given a resource in string or object formats, return it as an
 * object.
 *
 * @param {Object|String} resource in xml, json, or an object
 *
 * @return {Object} a FHIR object
 */
export function normalizeResource(resource) {
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
export function processOperation(operation) {
  return Object
      .values(operation.parameter)
      .reduce(
          function(op, i) {
            switch (i.name) {
              case 'type':
                return Object.assign(op, {operator: i.valueCode});
              case 'path':
                return Object.assign(op, {
                  path: i.valueString,
                });
              case 'name':
                return Object.assign(op, {name: i.valueString});
              case 'value':
                return Object.assign(op,
                    {value: processValue(i)});
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
}

/**
 * Process a value and return it's canonoical (json) form
 *
 * @param {Object} value the node containing the value
 *
 * @return {any} the value
 */
export function processValue(value) {
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
    return value.valueBase64Binary;
  }

  if (value.valueBoolean) {
    return value.valueBoolean;
  }

  if (value.valueCanonical) {
    return value.valueCanonical;
  }

  if (value.valueCodeableConcept) {
    return value.valueCodeableConcept;
  }

  if (value.valueCode) {
    return value.valueCode;
  }

  if (value.valueDate) {
    return value.valueDate;
  }

  if (value.valueDateTime) {
    return value.valueDateTime;
  }

  if (value.valueDecimal) {
    return value.valueDecimal;
  }

  if (value.valueHumanName) {
    return value.valueHumanName;
  }

  if (value.valueId) {
    return value.valueId;
  }

  if (value.valueInstant) {
    return value.valueInstant;
  }

  if (value.valueInteger) {
    return value.valueInteger;
  }

  if (value.valueMarkdown) {
    return value.valueMarkdown;
  }

  if (value.valueOid) {
    return value.valueOid;
  }

  if (value.valuePositiveInt) {
    return value.valuePositiveInt;
  }

  if (value.valueString) {
    return value.valueString;
  }

  if (value.valueTime) {
    return value.valueTime;
  }

  if (value.valueUnsignedInt) {
    return value.valueUnsignedInt;
  }

  if (value.valueUri) {
    return value.valueUri;
  }

  if (value.valueUrl) {
    return value.valueUrl;
  }

  if (value.valueUuid) {
    return value.valueUuid;
  }

  if (value.valueIdentifier) {
    return value.valueIdentifier;
  }

  throw new Error(`Unsupported value.  Got ${JSON.stringify(value)}.`);
}
