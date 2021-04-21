/*
 * Copyright 2021, careMESH Inc.  Refer to LICENSE.md for licensing terms.
 */

const _ = require('lodash');
const {Fhir} = require('fhir');
const {normalizeResource, processOperation, resourceFormat, cleanupResource} =
require('./helpers');
const validate = require('@d4l/js-fhir-validator');
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
    params = normalizeResource(params);

    if (params.resourceType !== 'Parameters') {
      throw new PatchInvalidError(`Invalid resource type for a patch: ${
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
    // Validate the resource before we start
    if (!validate(resource)) {
      throw new PatchInvalidError(
          _.get(validate.errors, '0.message', 'Unknown Error'),
      );
    }


    const fmt = resourceFormat(resource);
    let rsc = normalizeResource(resource);
    for (const op of this._operations) {
      rsc = op.apply(rsc);
    }

    rsc=cleanupResource(rsc);

    if (!validate(resource)) {
      throw new PatchInvalidError(
          _.get(validate.errors, '0.message', 'Unknown Error'),
      );
    }

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
