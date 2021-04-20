const {normalizeResource, processOperation} = require('./helpers');
const {Fhir} = require('fhir');
const cleanupResource = require('./cleanup-resource');

const fhir = new Fhir();

module.exports = class FhirPatch {
  /**
   *
   * @param {Object|String} params
   */
  constructor(params) {
    params = normalizeResource(params);
    if (params.resourceType !== 'Parameters') {
      throw new Error(`Invalid resource type for a patch: ${
        params.resoruceType}`);
    }

    this._operations = [];
    for (const op of params.parameter || []) {
      this._operations.push(processOperation(op));
    }
  }

  /**
   * Apply the patch to the provided resource
   *
   * @param {Resource|String} resource as object or string
   *
   * @return {Object} the resource in object format.
   */
  apply(resource, returnType) {
    let rsc = normalizeResource(resource);
    for (const op of this._operations) {
      rsc = op.apply(rsc);
    }

    rsc=cleanupResource(rsc);

    if (returnType === 'xml') {
      return fhir.objToXml(rsc);
    }
    return rsc;
  }
};
