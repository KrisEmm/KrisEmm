const { watch, series, src, dest } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const del = require('del');

sass.compiler = require('sass');

const data = require('./src/data/db.json')
function pugTranspile(cb) {
    return src('src/pages/*.pug')
        .pipe(pug({
            data: data,
            pretty: true
        }))
        .pipe(dest('public/'));
}
function sassTranspile(cb) {
    return src('src/styles/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(dest('public/styles/'));
}

function assetsCopy(cb) {
    return src('src/assets/**/*')
        .pipe(dest('public/assets/'));
}

function watcher() {
    watch('src/styles/**/*.scss', sassTranspile);
    watch('src/js/**/*.js', pugTranspile);
    watch(['src/pages/*.pug', 'src/pages/components/*.pug'], pugTranspile);
};

function clean() {
    return del([
        'public/',
    ]);
}
exports.prod = series(
    clean,
    pugTranspile,
    sassTranspile,
    assetsCopy,
)
exports.dev = series(
    clean,
    pugTranspile,
    sassTranspile,
    assetsCopy,
    watcher
);