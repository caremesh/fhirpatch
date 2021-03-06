/*
 * Copyright 2021, careMESH Inc.  Refer to LICENSE.md for licensing terms.
 */

const _ = require('lodash');
const {Fhir} = require('fhir');
const {normalizeResource, parseOperation, resourceFormat, cleanupResource} =
  require('./helpers');
const {PatchInvalidError} = require('./errors');

const fhir = new Fhir();
module.exports = class FhirPatch {
  /**
   * Convenience method to apply a patch without an instance
   *
   * @param {Resource|string} resource as object or string
   * @param {string|Object} patch the patch to apply
   *
   * @return {string|Object} the resource in the same format it was provided in
   */
  static apply(resource, patch) {
    patch = new FhirPatch(patch);
    return patch.apply(resource);
  }

  /**
   *
   * @param {Object|String} params
   */
  constructor(params) {
    if (params) {
      params = normalizeResource(params);

      if (params.resourceType !== 'Parameters') {
        throw new PatchInvalidError(`Invalid resource type for a patch: ${
          params.resourceType}`);
      }
    }

    this._operations = [];
    for (const op of _.get(params, 'parameter', [])) {
      this._operations.push(parseOperation(op));
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

  /**
   * Return a JSON serializable form of the patch
   *
   * @return {Object}
   */
  toJSON() {
    return {
      resourceType: 'Parameters',
      parameter: _.map(this.operations, (i) => i.toJSON()),
    };
  }
};
