const _ = require('lodash');
const fp = require('fhirpath');
const arrayMove = require('array-move');

module.exports = class Operation {
  constructor(params) {
    _.assign(this, params);
  }

  apply(resource) {
    let res;

    // Get the containing path.
    const containingPath = this.path
        .split(/\./g)
        .slice(0, -1)
        .join('.');

    // Extract everything after the last period and get any index that's present
    let tail; let idx;
    const parts = this.path.match(/\.(\w+)(\[(\d+)\])?$/);
    if (parts) {
      [, tail,, idx] = parts;
    }

    switch (this.operator) {
      case 'add':
        res = fp.evaluate(resource, this.path);
        res[0][this.name] = this.value;
        break;
      case 'delete':
        res = fp.evaluate(resource, containingPath);
        if (idx) {
          res[0][tail].splice(idx, 1);
        } else {
          delete res[0][tail];
        }
        break;
      case 'insert':
        res = fp.evaluate(resource, containingPath);
        res[0][tail].splice(this.index, 0, this.value);
        break;
      case 'move':
        res = fp.evaluate(resource, containingPath);
        arrayMove.mutate(res[0][tail], this.source, this.destination);
        break;
      case 'replace':
        res = fp.evaluate(resource, containingPath);
        res[0][tail] = this.value;
        break;
      default:
        throw new Error(`Unsupported operation type ${this.operator}`);
    }
    return resource;
  }

  set path(_path) {
    this._path = _path;
  }

  get path() {
    return this._path;
  }
};
