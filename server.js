const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const config = require('./webpack.config')
const baseHTML = require('./src/index.html')

const ip = '0.0.0.0'
const port = process.env.PORT || 3000
const app = express()
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}))

app.get('*', (req, res) => {
  res.send(baseHTML())
})

app.listen(port, ip, err => {
  if (err) {
    console.warn(err)
    return
  }

  console.info('\x1b[32m', `[Development] Express is running on http://${ip}:${port}`, '\x1b[0m')
})
