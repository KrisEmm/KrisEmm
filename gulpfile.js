const { watch, series, src, dest } = require('gulp');
const pug = require('gulp-pug');
const pug_transpiler = require('pug');
const sass = require('gulp-sass');
const del = require('del');
const fs = require('fs');
const path = require('path');

sass.compiler = require('sass');

const data = require('./src/data/db.json')

function createrHtmlFiles(repo, data) {
    const pathTemplate = "src/pages/templates/project.pug";
    const pathHtmlFiles = "public/";
    const html = pug_transpiler.renderFile(
        path.join(__dirname, pathTemplate),
        {
            repo,
            data,
            pretty: true
        }
    )
    fs.appendFile(
        path.join(__dirname, `${pathHtmlFiles}/${repo.name}.html`),
        html,
        function (err) {
            if (err) throw err;
        }
    )
}
function pugTranspile(cb) {
    return src('src/pages/*.pug')
        .pipe(pug({
            locals: data,
            pretty: true
        }))
        .pipe(dest('public/'));
}
function pugTranspileProjectFiles(cb) {
    if (data.repositories.length <= 0) return Promise.resolve();
    for (const repo of data.repositories) {
        createrHtmlFiles(repo, data)
    }
    return Promise.resolve();
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
    pugTranspileProjectFiles,
    sassTranspile,
    assetsCopy,
)
exports.dev = series(
    clean,
    pugTranspile,
    pugTranspileProjectFiles,
    sassTranspile,
    assetsCopy,
    watcher
);