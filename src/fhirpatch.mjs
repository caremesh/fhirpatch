import {normalizeResource, processOperation} from './helpers.mjs';

export default class FhirPatch {
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
  apply(resource) {
    resource = normalizeResource(resource);
    for (const op of this._operations) {
      if (op.path) {
        if (op.path[0] !== resource.resourceType) {
          continue;
        }
      }

      switch (op.type) {
        case 'replace':
          const resource = this.modify(resource, op);
        default:
          throw new Error(`Unsupported operation type ${op.type}`);
      }
    }
    return resource;
  }

  // /**
  //  * Descend the tree
  //  *
  //  * @param {Object} resource - the resource to modify
  //  * @param {Object} op - the operation to apply
  //  *
  //  * @returns {Object} the modified resource
  //  */
  // function modify(resource, op) {
  //   if ()
  // }
};
