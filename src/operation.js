/*
 * Copyright 2021, careMESH Inc.  Refer to LICENSE.md for licensing terms.
 */

const _ = require('lodash');
const fp = require('fhirpath');
const fhir = require('fhir');
const arrayMove = require('array-move');
const {PatchInvalidError, PathNotFoundError} = require('./errors');

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
   * @throws {PatchInvalidError} when patch is invalid
   * @throws {PathNotFoundError} when a resource path specified in the operation
   *                             was not found.
   */
  apply(resource) {
    resource = this.cleanupResource(resource);
    let res;

    switch (this.type) {
      case 'add':
        res = fp.evaluate(resource, this.path);
        if (res.length == 0) {
          throw new PathNotFoundError(`Nothing to modify at path ${this.path}`);
        }
        res[0][this.name] = this.value;
        break;
      case 'delete':
        // if the tail path contains an operation, patch it to be an absolute index
        if (this.tail.path.startsWith('where\(')) {
          const [idx] = fp.evaluate(resource, `${this.path}.$index`);
          if (typeof idx === 'undefined') {
            break;
          }
          this.path = `${this.containingPath}[${idx}]`;
        }

        res = fp.evaluate(resource, this.containingPath);

        if (res[0]) {
          // it is not an error if a path to delete doesn't already exist
          if (this.tail.index) {
            if (res.length == 0) {
              throw new PathNotFoundError(
                  `Attempt to modify index but path ${this.containingPath
                  } is not array`);
            }

            res[0][this.tail.path].splice(this.tail.index, 1);
          } else {
            delete res[0][this.tail.path];
          }
        }
        break;
      case 'insert':
        res = fp.evaluate(resource, this.containingPath);
        if (res.length == 0) {
          throw new PathNotFoundError(
              `Nothing to modify at path ${this.containingPath}`);
        }

        if (!_.has(res, `0.${this.tail.path}`)) {
          res[0][this.tail.path] = [];
        }

        res[0][this.tail.path].splice(this.index, 0, this.value);
        break;
      case 'move':
        res = fp.evaluate(resource, this.containingPath);
        if (res.length == 0) {
          throw new PathNotFoundError(
              `Nothing to modify at path ${this.containingPath}`);
        }
        arrayMove.mutate(res[0][this.tail.path], this.source, this.destination);
        break;
      case 'replace':
        res = fp.evaluate(resource, this.containingPath);
        if (res.length == 0) {
          throw new PathNotFoundError(
              `Nothing to modify at path ${this.containingPath}`);
        }
        if (this.tail.index) {
          res[0][this.tail.path][this.tail.index] = this.value;
        } else {
          res[0][this.tail.path] = this.value;
        }

        break;
      default:
        throw new Error(`Unsupported operation type ${this.type}`);
    }
    return resource;
  }

  /**
   * this function removes all empty collections (recursively) from a FHIR
   * object so that we comply with the FHIR spec which forbids empty containers
   * in JSON form.
   *
   * @param {Object} val the resource to cleanup
   * @return {Object}
   */
  cleanupResource(val) {
    let node = _.clone(val);

    if (_.isBoolean(node) || _.isNull(node) || _.isNumber(node)) {
      return node;
    }

    if (_.isArray(node)) {
      node = _.map(node, (i) => this.cleanupResource(i));
    } else if (_.isObject(node)) {
      node = _.mapValues(node, (i) => this.cleanupResource(i));
      node = _.pickBy(node, (i) => (
        (i) === false || !!i
      ));
    }

    if (_.isEmpty(node) && (node !== false)) {
      return undefined;
    }


    return node;
  }


  /**
   * Get the containing path for this operation.  This is defined as every
   * path element before the final '.'.
   */
  get containingPath() {
    return this.pathTokens.slice(0, -1).join('.');
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
    } else {
      path = this.pathTokens.reverse()[0];
    }
    return {path, index};
  }

  /**
   * returns a JSON serializable represenation of the operation
   *
   * @return {Object}
   */
  toJSON() {
    const result = {
      name: 'operation',
      parameter: [
        {name: 'type', valueCode: this.type},
        {name: 'path', valueString: this.path},
      ],
    };

    if (_.has(this, 'value')) {
      if (!this.valueType) {
        throw new Error(
            `Couldn't call toJSON on FHIR operation without value type!`);
      }

      result.parameter.push({
        name: 'value',
        [this.valueType]: this.value,
      });
    }

    if (this.name) {
      result.parameter.push({
        name: 'name',
        valueString: this.name,
      });
    }

    if (_.isNumber(this.index)) {
      result.parameter.push({
        name: 'index',
        valueInteger: this.index,
      });
    }

    if (_.isNumber(this.source)) {
      result.parameter.push({
        name: 'source',
        valueInteger: this.source,
      });
    }

    if (_.isNumber(this.destination)) {
      result.parameter.push({
        name: 'destination',
        valueInteger: this.destination,
      });
    }

    return result;
  }

  /**
   * return the tokenized fhirpath
   */
  get pathTokens() {
    /**
     * returns path element rendered to string
     *
     * @param {Object} p path element
     * @return {String}
     */
    function renderPath(p) {
      if (_.isString(p)) {
        return p;
      }

      if (_.isObject(p)) {
        if (_.has(p, 'left') && _.has(p, 'right') && _.has(p, 'op')) {
          return `${renderPath(p.left)} ${p.op} ${renderPath(p.right)}`;
        }

        if (_.has(p, 'name') && _.has(p, 'params')) {
          return `${p.name}(${renderPath(p.params)})`;
        }

        if (_.has(p, 'path')) {
          return renderPath(p.path);
        }

        if (_.has(p, 'value')) {
          return `"${p.value}"`;
        }
      }

      if (_.isArray(p)) {
        return _.map(p, renderPath);
      }

      throw new Error(`Couldn't parse path ${JSON.stringify(p)}`);
    }

    const parsed = new fhir.FhirPath().parse(this.path);
    const paths = _.map(parsed[0].path, renderPath);
    if (_.has(parsed, '0.resourceType')) {
      return [_.get(parsed, '0.resourceType'), ...paths];
    }
    return paths;
  }

  /**
   * Confirm that the operation is valid.
   *
   * @throws {PatchInvalidError} when the patch is invalid
   */
  validate() {
    if (!this.path) {
      throw new PatchInvalidError(
          `Missing required parameter for type ${this.type}: path`,
      );
    }

    switch (this.type) {
      case 'add':
        if (_.isEmpty(this.name)) {
          throw new PatchInvalidError(
              `Missing required parameter for type ${this.type}: name`);
        }
        if (_.isEmpty(this.value)) {
          throw new PatchInvalidError(
              `Missing required parameter for type ${this.type}: value`,
          );
        }
        break;
      case 'delete':
        break;
      case 'insert':
        if (_.isEmpty(this.value)) {
          throw new PatchInvalidError(
              `Missing required parameter for type ${this.type}: value`,
          );
        }
        if (!_.isInteger(this.index)) {
          throw new PatchInvalidError(
              `Missing required parameter for type ${this.type}: index`,
          );
        }
        break;
      case 'move':
        if (!_.isInteger(this.source)) {
          throw new PatchInvalidError(
              `Missing required parameter for type ${this.type
              }: source`,
          );
        }
        if (!_.isInteger(this.destination)) {
          throw new PatchInvalidError(
              `Missing required parameter for type ${this.type
              }: destination`,
          );
        }
        break;
      case 'replace':
        if (!_.isBoolean(this.value) && !this.value) {
          throw new PatchInvalidError(
              `Missing required parameter for type ${this.type}: value`,
          );
        }
        break;
      default:
        throw new PatchInvalidError(
            `Unsupported operation type ${this.type}`,
        );
    }
  }
};
