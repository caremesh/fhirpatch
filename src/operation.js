/*
 * Copyright 2021, careMESH Inc.  Refer to LICENSE.md for licensing terms.
 */

const _ = require('lodash');
const fp = require('fhirpath');
const arrayMove = require('array-move');

module.exports = class Operation {
  /**
   * Build a single patch operation.
   *
   * @param {Object} params
   * @param {string} params.type the operation type
   * @param {any} params.value the value
   * @param {number} params.index the index to apply the operation to for insert
   * @param {number} params.source the index to move an element from (for move)
   * @param {number} params.destination the index to move to (for move)
   *
   */
  constructor(params) {
    _.assign(this, params);
  }

  /**
   *
   * @param {Object} resource an object repreentation of a FHIR resource to
   *                          modify
   * @return {Object} the modified resource
   */
  apply(resource) {
    let res;

    switch (this.operator) {
      case 'add':
        res = fp.evaluate(resource, this.path);
        res[0][this.name] = this.value;
        break;
      case 'delete':
        res = fp.evaluate(resource, this.containingPath);
        if (this.tail.index) {
          res[0][this.tail.path].splice(this.tail.index, 1);
        } else {
          delete res[0][this.tail.path];
        }
        break;
      case 'insert':
        res = fp.evaluate(resource, this.containingPath);
        res[0][this.tail.path].splice(this.index, 0, this.value);
        break;
      case 'move':
        res = fp.evaluate(resource, this.containingPath);
        arrayMove.mutate(res[0][this.tail.path], this.source, this.destination);
        break;
      case 'replace':
        res = fp.evaluate(resource, this.containingPath);
        if (this.tail.index) {
          res[0][this.tail.path][this.tail.index] = this.value;
        } else {
          res[0][this.tail.path] = this.value;
        }

        break;
      default:
        throw new Error(`Unsupported operation type ${this.operator}`);
    }
    return resource;
  }


  /**
   * Get the containing path for this operation.  This is defined as every
   * path element before the final '.'.
   */
  get containingPath() {
    return this.path
        .split(/\./g)
        .slice(0, -1)
        .join('.');
  }

  /**
   * Return the "tail" of the FHIR path for this delta along with any index.
   *
   * Extract everything after the last period and get any index that's present
   * so we can use it in the operations below.
   * Note that this logic may fail with certain operations if the last element
   * of the path is not a "simple" element.  For example, to update a
   * patient's home address, you'd need to use a path like:
   *
   *   Patient.address.where(use='home').line[0]
   *
   * This may require you to use multiple operations to accomplish your
   *  purpose but from what I can tell HAPI has the same limitation.
   *
   * @return {{path, index}}
   */
  get tail() {
    let path; let index;
    const parts = this.path.match(/\.(\w+)(\[(\d+)\])?$/);
    if (parts) {
      [, path,, index] = parts;
    }
    return {path, index};
  }
};
