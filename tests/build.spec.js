const { buildListPages } = require('../build/build')
const { listIssues } = require('../build/resource')
const { getConfig } = require('../build/util')
const { distDir, PAGE_NUM } = getConfig()
const fs = require('fs')

test('should build all pages in dist', async () => {
  const { data: issues } = await listIssues()
  buildListPages(issues)
  let pageCount = issues.length / PAGE_NUM
  if (issues.length % PAGE_NUM) pageCount++
  const flag = (new Array(pageCount)).fill('.').reduce((pre, cur, index) => {
    return pre && fs.existsSync(`${distDir}/page/${index + 1}/index.html`)
  }, true)
  expect(flag).toBe(true)
}, 10000)
