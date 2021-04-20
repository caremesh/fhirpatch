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