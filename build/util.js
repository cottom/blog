const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const shell = require('shelljs')

const commonConfig = {
  devHost: 'localhost',
  devPort: '4312',
  siteUrl: 'https://blog.cottom.cc',
  siteTitle: 'cottom\'s blog',
  PAGE_NUM: 10,
  distDir: path.join(__dirname, '..', './dist'),
  navs: [
    {
      name: 'Blog',
      path: '/',
      icon: 'cottom-icon-home'
    },
    {
      name: 'Archives',
      path: '/archives',
      icon: 'cottom-icon-menu'
    }
  ]
}

exports.commonConfig = commonConfig

exports.getConfig = () => {
  const ciConfig = process.env.CIRCLECI ? getConfigFromENV() : require('../config/test.js')
  return {
    ...commonConfig,
    ...ciConfig
  }
}

function getConfigFromENV () {
  const { Authorization, owner, repo } = process.env
  return { Authorization, owner, repo }
}

exports.filterSelfIssue = issue => issue.author_association === 'OWNER' && !issue.pull_request

exports.rmDir = dir => rimraf.sync(dir)

exports.createEmptyFile = filePath => {
  fs.createWriteStream(filePath).close()
}

exports.writeFile = (_path, content) => {
  const dirName = path.dirname(_path)
  if (!fs.existsSync(dirName)) shell.mkdir('-p', dirName)
  fs.writeFileSync(_path, content)
}

exports.debounce = fn => {
  let timer = null
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(fn, 800)
  }
}

exports.throttle = fn => {
  let time = null
  return () => {
    if (!time || Date.now() - time > 400) {
      fn()
      time = Date.now()
    }
  }
}

exports.log = (msg, ...args) => console.log(`--- ${msg} ---`, ...args)

exports.formatterTitle = str => str && str.trim().toLowerCase().replace(/\s+/g, '-')

exports.LINK_SVG = `<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`
