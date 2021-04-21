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
   * @param {Resource|string} resource as object or string
   *
   * @return {string|Object} the resource in the same format it was provided in
   */
  apply(resource) {
    const fmt = resourceFormat(resource);
    let rsc = normalizeResource(resource);
    for (const op of this._operations) {
      rsc = op.apply(rsc);
    }

    rsc=cleanupResource(rsc);

    switch (fmt) {
      case 'xml':
        return fhir.objToXml(rsc);
      case 'json':
        return JSON.stringify(rsc);
      default:
        return rsc;
    }
  }

  /**
   * Get the list of operations for this patch.
   */
  get operations() {
    return this._operations;
  }

  /**
   * Set the list of operations for this patch.
   *
   * @param {Array} val
   */
  set operations(val) {
    this._operations = val;
  }
};
