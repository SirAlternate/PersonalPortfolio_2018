const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const include = require('gulp-include');
const minify = require('gulp-minify');
const inject = require('gulp-inject');
const cleanCss = require('gulp-clean-css');
const prettify = require('gulp-prettify');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminZopfli = require('imagemin-zopfli');
const imageminMozjpeg = require('imagemin-mozjpeg');

const templateOptions = {
    batch: ['./src/templates/partials'],
    helpers: {
        if_even: function(index, options) {
            if ((index % 2) == 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        delay_inc: function(index) {
            return index * 50;
        }
    },
    compile: {
        preventIndent: 'true'
    }
};

gulp.task('images', () => {
    gulp.src(['./src/images/**/**.jpg', './src/images/**/**.png', './src/images/**/**.jpeg', './src/images/**/**.svg'])
        .pipe(imagemin([
            // PNG
            imageminPngquant({
                speed: 1,
                quality: 98
            }),
            imageminZopfli({
                more: true
            }),

            // SVG
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            }),

            // JPG
            imagemin.jpegtran({
                progressive: true
            }),
            imageminMozjpeg({
                quality: 90
            })
        ]))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('styles', () => {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(cleanCss({
            keepSpecialComments: '*',
            spaceAfterClosingBrace: true
        }))
        .pipe(rename({ suffix: '-min' }))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('scripts', () => {
    gulp.src('./src/js/**/*.js')
        .pipe(include({
            includePaths: [
                'node_modules',
                'vendor'
            ]
        }))
        .pipe(minify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('templates', () => {
    gulp.src('./src/templates/index.handlebars')
        .pipe(handlebars(require('./src/data.json'), templateOptions))
        .pipe(inject(gulp.src([
            './dist/css/styles-min.css',
            './dist/js/scripts-min.js',
        ]), {
            ignorePath: '/dist/',
            removeTags: true,
            addRootSlash: false
        }))
        .pipe(prettify({
            indent_size: 4
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['scripts', 'styles', 'templates']);

gulp.task('watch', () => {
    gulp.watch('./src/js/**/*.js', ['scripts']);
    gulp.watch('./src/sass/**/*.scss', ['styles']);
    gulp.watch('./src/templates/**/*.handlebars', ['templates']);
    gulp.watch('./src/data.json', ['templates']);
});
