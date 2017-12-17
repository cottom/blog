const { listIssues } = require('./resource')
const { buildListPages, buildSignIssue } = require('./build')
const { filterSelfIssue, log, formatterTitle } = require('./util')

const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const config = require('../config')

const { esEndPoints } = config
const { format } = require('date-fns')

const _format = v => v && format(new Date(v), 'YYYY-MM-DD')

exports.buildHTML = async () => {
  // log('to remove cache dist')
  // rmDir(distDir)
  // log('success remove dist')
  log('to fetch issues')
  const { data } = await listIssues()
  log('success fetch issues')
  const issues = data.filter(filterSelfIssue).map(item => {
    const { title, created_at, updated_at } = item
    item.formatterTitle = formatterTitle(title)
    item.created_at = _format(created_at)
    item.updated_at = _format(updated_at)
    return item
  })
  log('start build blog')
  buildListPages(issues)
  issues.forEach(buildSignIssue)
  log('success build blog')
}

exports.buildJS = async () => {
  return Promise.all(esEndPoints.map(([input, file]) => {
    return rollup({
      input,
      plugins: [babel({
        babelrc: false,
        exclude: 'node_modules/**',
        'presets': [
          ['env', {
            'modules': false
          }]
        ],
        'plugins': ['external-helpers']
      })]
    }).then(bundle => bundle.write({file, format: 'umd'}))
  }))
}
