import _ from 'lodash';
import {Fhir} from 'fhir';
import {compile} from './fhirpath.mjs';

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
          function(accumulator, i) {
            switch (i.name) {
              case 'type':
                return Object.assign(accumulator, {type: i.valueCode});
              case 'path':
                return Object.assign(accumulator, {path: compile(i.valueString)});
              case 'name':
                return Object.assign(accumulator, {name: i.valueString});
              case 'value':
                return Object.assign(accumulator,
                    {value: processValue(i)});
              case 'index':
                return Object.assign(accumulator, {index: i.valueInteger});
              case 'source':
                return Object.assign(accumulator, {source: i.valueInteger});
              case 'destination':
                return Object.assign(accumulator, {
                  destination: i.valueInteger});
              default:
                throw new Error(`Received unrecognized parameter: ${i}`);
            }
          },
          {},
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
  if (value.valueBase64Binary) {
    return value.valueBase64Binary;
  }

  if (value.valueBoolean) {
    return value.valueBoolean;
  }

  if (value.valueCanonical) {
    return value.valueCanonical;
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

// /**
//  * Returns a tokenized version of the provided path
//  *
//  * @param {String} path
//  *
//  * @return {Array}
//  */
// function parse(path=[]) {
//   if (path.length === 0) {
//     return [];
//   }
//   [head, tail] = path.split(/\./, path, 1);

//   // Is it an array indexing operation?
//   if (head.match(/(\w+)\[(\d+)\]/)) {
//     return [...processIndex(head), ...tail];
//   }


//   // Is it a function call?
//   if (/(\w+)\((\d+)\)/) {
//     return [...processFunction(head), ...parsePath(tail)];
//   }

//   // is it an expression?
// }

