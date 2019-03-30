var express = require('express')
var webpack = require('webpack')
var path = require('path')
var config = require('./build/webpack.config.js')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

// html-webpack-plugin和chunkhash有冲突，所以这里要改成hash
config.output.filename = '[name].[hash].js'
config.output.publicPath = '/'
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
)
config.entry.app = ['webpack-hot-middleware/client', './src/main.js']

var app = express()
var compiler = webpack(config)

var devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: '/',
  stats: {
    colors: true,
    chunks: false
  },
  watchOptions: {
    poll: true
  }
})

var hotMiddleware = webpackHotMiddleware(compiler)

// 为了修改html文件也能实现热加载，使用webpack插件来监听html源文件改变事件
/*
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      // 发布事件
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})
*/

app.use(devMiddleware)
app.use(hotMiddleware)

app.use('*', function (req, res, next) {
  var filename = path.join(compiler.outputPath, 'index.html')
  compiler.outputFileSystem.readFile(filename, function (err, result) {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

app.listen(8888, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:8888')
})
