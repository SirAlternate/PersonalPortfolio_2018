const gulp = require('gulp');
const rename = require('gulp-rename');
const include = require('gulp-include');
const sass = require('gulp-sass');
const handlebars = require('gulp-compile-handlebars');
const minify = require('gulp-minify');
const inject = require('gulp-inject');

const templateOptions = {
    batch: ['./src/templates/partials'],
    helpers: {
        if_even: function(index, options) {
            if ((index % 2) == 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
};

gulp.task('styles', () => {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('styles-min', () => {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('scripts', () => {
    gulp.src('./src/js/**/*.js')
        .pipe(include({
            includePaths: [
                'node_modules'
            ]
        }))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts-min', () => {
    gulp.src('./src/js/**/*.js')
        .pipe(include({
            includePaths: [
                'node_modules'
            ]
        }))
        .pipe(minify())
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('templates', () => {
    gulp.src('./src/templates/index.handlebars')
        .pipe(handlebars(require('./src/data.json'), templateOptions))
        .pipe(inject(gulp.src(['./dist/css/styles.css', './dist/js/scripts.js']), {
            ignorePath: '/dist/',
            removeTags: true,
            addRootSlash: false
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('templates-min', () => {
    gulp.src('./src/templates/index.handlebars')
        .pipe(handlebars(require('./src/data.json'), templateOptions))
        .pipe(inject(gulp.src(['./dist/css/styles.min.css', './dist/js/scripts.min.js']), {
            ignorePath: '/dist/',
            removeTags: true,
            addRootSlash: false
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('images', () => {
    gulp.src('./src/images/**/**.*')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('default', ['images', 'scripts', 'styles', 'templates']);

gulp.task('watch', () => {
    gulp.watch('./src/js/**/*.js', ['scripts']);
    gulp.watch('./src/sass/**/*.scss', ['styles']);
    gulp.watch('./src/templates/**/*.handlebars', ['templates']);
    gulp.watch('./src/data.json', ['templates', 'images']);
});

gulp.task('prod', ['images', 'styles-min', 'scripts-min', 'templates-min']);
