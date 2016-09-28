var gulp         = require('gulp');
var concat       = require('gulp-concat-util');
var webpack      = require('gulp-webpack');
var screeps      = require('gulp-screeps');
var credentials  = require('./credentials.js');
var eslint       = require('gulp-eslint');

gulp.task('sync', function() {
  gulp.src('dist/*.js')
    .pipe(screeps(credentials));
});

gulp.task('concatenate', function() {
  gulp.src('src/ai/*.js')
    .pipe(concat('ai.js'))
    .pipe(concat.header('var component = {};\n\n'))
    .pipe(concat.footer('\nmodule.exports = component;'))
    .pipe(gulp.dest('compile/'));
  gulp.src('src/controller/*.js')
    .pipe(concat('controller.js'))
    .pipe(concat.header('var component = {};\n\n'))
    .pipe(concat.footer('\nmodule.exports = component;'))
    .pipe(gulp.dest('compile/'));
  gulp.src('src/template/*.js')
    .pipe(concat('template.js'))
    .pipe(concat.header('var component = {};\n\n'))
    .pipe(concat.footer('\nmodule.exports = component;'))
    .pipe(gulp.dest('compile/'));
  gulp.src('src/main.js')
    .pipe(gulp.dest('compile/'));
});

gulp.task('compile', function() {
  gulp.src('compile/main.js')
    .pipe(webpack( {
      output: {
        filename: 'main.js',
        libraryTarget: 'commonjs2',
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              presets: [
                require.resolve('babel-preset-react'), // React preset is needed only for flow support.
                require.resolve('babel-preset-es2015'),
                require.resolve('babel-preset-stage-2'),
              ],
            },
          },
        ],
      },
    } ))
    .pipe(gulp.dest('dist/'));
});

gulp.task('eslint', function() {
  gulp.src('compile/*.js')
    .pipe(eslint( {
      parser: 'babel-eslint',
      env: {
        es6: true,
        node: true,
      },
      'extends': 'eslint:recommended',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module'
      },
      rules: {
        indent: [
          'error',
          2
        ],
        'linebreak-style': [
          'error',
          'unix'
        ],
        quotes: [
          'error',
          'single'
        ],
        semi: [
          'error',
          'always'
        ],
        'no-console': 0,
      }
    } ));
});
