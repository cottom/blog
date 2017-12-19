const pug = require('pug')
const cheerio = require('cheerio')

const md = require('marked')
const config = require('./util').getConfig()
const { commonConfig, writeFile, LINK_SVG } = require('./util')

const { siteUrl, siteTitle, PAGE_NUM, distDir, basedir } = config

const buildSignIssue = issue => {
  const { number, created_at, updated_at, title, body: _body, html_url, labels, formatterTitle } = issue
  const renderFn = pug.compileFile('./public/template/blog-item-page.pug', {basedir})
  const renderer = new md.Renderer()
  const outline = []
  renderer.heading = (text, level) => {
    if (level <= 2) {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
      outline.push({
        html: `<a class="link-level-${level}" href="#${escapedText}">${text}</a>`
      })
      return `
        <h${level} class="anchor-heading">
          <a class="anchor" name="${escapedText}" href="#${escapedText}">
            ${LINK_SVG}
          </a>
          ${text}
        </h${level}>
      `
    } else {
      return `
      <h${level}>${text}</h${level}>
      `
    }
  }
  const highlight = code => require('highlight.js').highlightAuto(code).value
  const body = md(_body, {renderer, highlight})
  const content = renderFn({
    created_at,
    updated_at,
    body,
    html_url,
    labels,
    title,
    outline,
    ...commonConfig,
    number
  })
  writeFile(`${distDir}/blog/${formatterTitle}/index.html`, content)
}

exports.buildSignIssue = buildSignIssue

const buildArchives = (issues = [], labels = []) => {
  const archives = issues.reduce((pre, cur) => {
    const { created_at } = cur
    const key = created_at.split('-')[0]
    if (!pre[key]) pre[key] = []
    pre[key].push(cur)
    return pre
  }, {})
  const renderFn = pug.compileFile('./public/template/blog-archives.pug', {basedir})
  const content = renderFn({
    archives,
    labels,
    ...commonConfig,
    pageTitle: `Archives | ${siteTitle}`
  })
  writeFile(`${distDir}/archives/index.html`, content)
}

const buildLabelPages = (issues, labels) => {
  const buildObj = labels.reduce((pre, cur) => {
    const { name } = cur
    pre[name] = issues.filter(issue => issue.labels.some(l => l.name === name))
    return pre
  }, {})
  Object.keys(buildObj).forEach(name => {
    const renderFn = pug.compileFile('./public/template/blog-labels.pug', {basedir})
    const content = renderFn({
      active: name,
      issues: buildObj[name],
      labels,
      ...commonConfig,
      pageTitle: `label: ${name} | ${siteTitle}`
    })
    writeFile(`${distDir}/label/${name}/index.html`, content)
  })
}

exports.buildListPages = issues => {
  const allLabels = []
  const blogs = issues.map(({id, html_url, title, body, user, created_at, updated_at, labels, formatterTitle}) => {
    const $ = cheerio.load(md(body))
    labels.forEach(item => (!allLabels.some(i => i.name === item.name) && allLabels.push(item)))
    return {
      created_at,
      updated_at,
      title,
      id,
      formatterTitle,
      body: $.root().text().slice(0, 200) + '...',
      labels,
      user,
      html_url
    }
  })
  let listPages = []
  let pageTmp = []
  for (let i = 0, length = blogs.length; i < length; i++) {
    pageTmp.push(blogs[i])
    if (!(i + 1) % PAGE_NUM) {
      listPages.push(pageTmp)
      pageTmp = []
    }
  }
  if (pageTmp.length && pageTmp.length % PAGE_NUM) listPages.push(pageTmp)
  listPages = listPages.map((item, index) => {
    let pageTitle = siteTitle
    if (index) pageTitle += ` - 第 ${index + 1} 页`
    return {
      labels: allLabels,
      blogs: item,
      pageTitle,
      siteUrl,
      pagination: {
        pageNum: PAGE_NUM,
        pageIndex: index + 1,
        total: listPages.length
      },
      ...commonConfig
    }
  })
  // build list page
  listPages.forEach((item, index) => {
    const renderFn = pug.compileFile('./public/template/blog-page.pug', {basedir})
    const content = renderFn(item)
    const _path = `${distDir}/page/${index + 1}/index.html`
    writeFile(_path, content)
    if (!index) writeFile(`${distDir}/index.html`, content)
  })
  // build archives page
  buildArchives(issues, allLabels)

  // build label pages
  buildLabelPages(issues, allLabels)
}
