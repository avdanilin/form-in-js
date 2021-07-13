const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const uglify = require('gulp-uglify')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const imagemin = require('gulp-imagemin') // Подключаем библиотеку для работы с изображениями
const pngquant = require('imagemin-pngquant') // Подключаем библиотеку для работы с png
cache = require('gulp-cache') // Подключаем библиотеку кеширования

function html() {
    return src('src/**.html') // Выборка исходных файлов для обработки плагином
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist')) // Вывод результирующего файла в папку назначения (dest - пункт назначения)
}

function scss() {
    return src('src/scss/**.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(concat('style.min.css'))
        .pipe(dest('dist'))
}

function js() {
    return src('src/js/**.js')
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(dest('dist'))
}

function img() {
    return src('src/img/**/*') // Берем все изображения из src
        .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(dest('dist/img')) // Выгружаем на продакшен
}

function clear() {
    return (del('dist') && cache.clearAll())
}

function serve() {
    sync.init({
        server: './dist'
    })

    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
    watch('src/js/**.js', series(js)).on('change', sync.reload)
}

exports.build = series(clear, html, img, scss, js)
exports.serve = series(clear, html, img, scss, js, serve)
exports.clear = clear