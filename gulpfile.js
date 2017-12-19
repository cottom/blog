const gulp = require('gulp')
const gulpUtil = require('gulp-util')
const del = require('del')
const stylus = require('gulp-stylus')
const runSequence = require('run-sequence')
const browserSync = require('browser-sync').create()

const config = require('./config')
const { buildHTML, buildJS } = require('./build/main')
const { debounce } = require('./build/util')

const reload = debounce(browserSync.reload)

const { dist } = config

gulp.task('clean', () => del(dist))

gulp.task('build:html', async (cb) => {
  await buildHTML()
})

gulp.task('build:js', async (cb) => {
  await buildJS()
})

gulp.task('build:css', () => {
  return gulp.src(['./public/css/*.styl', '!./public/css/_*.styl'])
    .pipe(stylus({compress: true, 'resolve url': true, 'include css': true}))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('build:dev', (cb) => {
  runSequence('clean', ['build:css', 'build:js', 'build:html'], 'server')
})
gulp.task('build', () => {
  runSequence('clean', ['build:css', 'build:js', 'build:html'])
})
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
  gulpUtil.log('-- init server --')
  gulp.watch('public/css/*.styl', ['build:css'])
  gulp.watch('public/js/*.js', ['build:js'])
  gulp.watch('public/**/*.pug', ['build:html'])
  gulp.watch('dist/**/*').on('change', reload)
})

gulp.task('dev', ['build:dev'])
