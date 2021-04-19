import util from './utilities.mjs';
import {ResourceNode} from './types.mjs';
const makeResNode = ResourceNode.makeResNode;

const engine = {};
export default engine;

engine.children = function(coll) {
  const model = this.model; // "this" is the context object

  return coll.reduce(function(acc, x) {
    const d = util.valData(x);
    x = makeResNode(x);
    if (typeof d === 'object') {
      for (const prop of Object.keys(d)) {
        const v = d[prop];
        var childPath = x.path + '.' + prop;
        if (model) {
          const defPath = model.pathsDefinedElsewhere[childPath];
          if (defPath) {
            childPath = defPath;
          }
        }
        if (Array.isArray(v)) {
          acc.push.apply(acc, v.map((n)=>makeResNode(n, childPath)));
        } else {
          acc.push(makeResNode(v, childPath));
        }
      }
      return acc;
    } else {
      return acc;
    }
  }, []);
};

engine.descendants = function(coll) {
  let ch = engine.children.call(this, coll); // "this" is the context object
  const res = [];
  while (ch.length > 0) {
    res.push.apply(res, ch);
    ch = engine.children.call(this, ch);
  }
  return res;
};

