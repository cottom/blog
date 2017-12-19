const path = require('path')
const resolve = _p => path.join(__dirname, _p)
module.exports = {
  src: resolve('./public'),
  dist: resolve('./dist'),
  siteTitle: 'Cottom\'s Blog',
  esEndPoints: [
    [resolve('./public/js/blog-list.js'), resolve('./dist/js/blog-list.js')],
    [resolve('./public/js/blog-item.js'), resolve('./dist/js/blog-item.js')],
    [resolve('./public/js/blog-tag.js'), resolve('./dist/js/blog-tag.js')]
  ],
  basedir: resolve(''),
  siteUrl: 'https://jerry-i.github.io',
  PAGE_NUM: 10,
  distDir: path.join(__dirname, './dist'),
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
