module.exports = {
  file: [
    "./.mocha.init.js",
  ],
  spec: [
    'src/*.test.mjs',
    'test/*.test.mjs'
  ],
  timeout: 20000,
  exit: true,
  // bail: true,
}