/*
 * Copyright 2021, careMESH Inc.  Refer to LICENSE.md for licensing terms.
 */

module.exports = {
  file: [
    "./.mocha.init.js",
  ],
  spec: [
    'src/*.test.js',
    'test/*.test.js'
  ],
  timeout: 20000,
  exit: true,
  // bail: true,
}