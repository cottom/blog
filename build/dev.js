
const express = require('express')
const chokidar = require('chokidar')
const path = require('path')
const {buildAll} = require('./main')

const {commonConfig: {devHost, devPort}, debounce} = require('./util')

const build = debounce(buildAll)

const app = express()
app.use(express.static(path.join(__dirname, '..', './dist')))
const watcher = chokidar.watch([path.join(__dirname, '..', './build'), path.join(__dirname, '..', 'public')])

watcher.on('ready', () => {
  watcher.on('all', () => {
    build()
  })
})

const init = async () => {
  app.listen(devPort, devHost)
  build()
  console.log(`--- start listener at http://${devHost}:${devPort} ---`)
}

init()
