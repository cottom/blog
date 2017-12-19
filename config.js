const path = require('path')
const resolve = _p => path.join(__dirname, _p)
module.exports = {
  src: resolve('./public'),
  dist: resolve('./dist'),
  siteTitle: 'Cottom\'s Blog',
  devHost: 'localhost',
  devPort: '4312',
  esEndPoints: [
    [resolve('./public/js/blog-list.js'), resolve('./dist/js/blog-list.js')],
    [resolve('./public/js/blog-item.js'), resolve('./dist/js/blog-item.js')],
    [resolve('./public/js/blog-tag.js'), resolve('./dist/js/blog-tag.js')]
  ],
  basedir: resolve('')
}
