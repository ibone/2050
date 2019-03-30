const path = require('path')
const cssnext = require('postcss-cssnext')

module.exports = {
  preserveWhitespace: false,
  cssModules: {
    root: '/',
    camelCase: true,
    localIdentName: '[hash:base64:8]'
  },
  postcss: [cssnext({})]
}
