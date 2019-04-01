const path = require('path')
const vueConfig = require('./vue-loader.config')
const HTMLPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const webpack = require('webpack')
const timeStamp = ((new Date()).getTime() + '').substring(8)

const config = {
  // devtool: '#source-map',
  entry: {
    app: './src/main.js',
    vendor: [
      'object-assign-shim',
      'es6-promise',
      'vue',
      'vue-router',
      'vuex',
      'vuex-router-sync'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: './',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name]-[chunkhash:8].js'
  },
  resolve: {
    alias: {
      // for import use
      '~src': path.resolve(__dirname, '../src')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin({
      hashDigestLength: 8
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    })
  ]
}

if (process.env.NODE_ENV === 'development') {
  // 添加环境变量，比如安卓的webviewBridge
  config.entry.app = [path.resolve(__dirname, '../src/main.js')]
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    // generate output HTML
    new HTMLPlugin({
      template: 'src/index.html',
      title: timeStamp,
      filename: path.resolve(__dirname, '../dist/index.html'),
      env: process.env.NODE_ENV
    })
  )
}

if (process.env.NODE_ENV === 'production') {
  // 添加环境变量，比如安卓的webviewBridge
  config.entry.app = [path.resolve(__dirname, '../src/main.js')]
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // generate output HTML
    new HTMLPlugin({
      template: 'src/index.html',
      title: timeStamp,
      filename: path.resolve(__dirname, '../dist/index.html'),
      env: process.env.NODE_ENV
    })
  )
}

module.exports = config
