module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  // we are disabling a lot of rules here.  This is mostly because
  // much of the code comes from a rather old-fashioned codebase
  // and it's not worth the time to try to make it conform to the
  // careMESH preferred styles at this time.
  'rules': {
    'max-len': ['off'],
    'require-jsdoc': ['off'],
    'valid-jsdoc': ['off'],
    'camelcase': ['off'],
    'no-var': ['off'],
    'new-cap': ['off'],
    'no-throw-literal': ['off'],
    'prefer-spread': ['off'],
    'no-extend-native': ['off'],
    'prefer-rest-params': ['off'],
    'prefer-spread': ['off'],
    'prefer-rest-params': ['off'],
    'brace-style': ['off'],
  },
};
