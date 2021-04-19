import util from './utilities.mjs';

const engine = {};

function ensureStringSingleton(x) {
  let d;
  if (x.length == 1 && typeof (d=util.valData(x[0])) === 'string') {
    return d;
  }
  throw new Error('Expected string, but got ' + JSON.stringify(d || x));
}

engine.indexOf = function(coll, substr) {
  const str = ensureStringSingleton(coll);
  return str.indexOf(substr);
};

engine.substring = function(coll, start, length) {
  const str = ensureStringSingleton(coll);
  if (util.isEmpty(start) || start < 0 || start >= str.length) {
    return [];
  }
  if (length === undefined || util.isEmpty(length)) {
    return str.substring(start);
  }
  return str.substring(start, start + length);
};

engine.startsWith = function(coll, prefix) {
  const str = ensureStringSingleton(coll);
  return str.startsWith(prefix);
};

engine.endsWith = function(coll, postfix) {
  const str = ensureStringSingleton(coll);
  return str.endsWith(postfix);
};

engine.containsFn = function(coll, substr) {
  const str = ensureStringSingleton(coll);
  return str.includes(substr);
};


engine.matches = function(coll, regex) {
  const str = ensureStringSingleton(coll);
  const reg = new RegExp(regex);
  return reg.test(str);
};

engine.replace = function(coll, regex, repl) {
  const str = ensureStringSingleton(coll);
  return str.replace(regex, repl);
};

engine.replaceMatches = function(coll, regex, repl) {
  const str = ensureStringSingleton(coll);
  const reg = new RegExp(regex);
  return str.replace(reg, repl);
};

engine.length = function(coll) {
  const str = ensureStringSingleton(coll);
  return str.length;
};

export default engine;
