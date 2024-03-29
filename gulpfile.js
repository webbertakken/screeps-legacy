const gulp = require('gulp');
const watch = require('gulp-watch');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const screeps = require('gulp-screeps');
const eslint = require('gulp-eslint');

gulp.task('watch', function() {
  return watch('src/**.js', ['sync']);
});

// This required me to install [screepsmod-auth] Authentication module from Steam Workshop
gulp.task('localsync', ['altsync']);
gulp.task('altsync', ['compile'], function() {
  return gulp.src('dist/*.js*')
    .pipe(
      screeps({
        host: process.env.SCREEPS_ALT_HOST,
        port: parseInt(process.env.SCREEPS_ALT_PORT),
        email: process.env.SCREEPS_EMAIL,
        password: process.env.SCREEPS_PASSWORD,
        branch: 'default',
        secure: false,
        ptr: false
      })
    );
});

gulp.task('sync', ['compile'], function() {
  return gulp.src('dist/*.js*')
    .pipe(
      screeps({
        email: process.env.SCREEPS_EMAIL,
        password: process.env.SCREEPS_PASSWORD,
        branch: 'screeps',
        ptr: false
      })
    );
});

gulp.task('compile', ['eslint'], function() {
  return gulp.src('src/main.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
        libraryTarget: 'commonjs2',
        sourceMapFilename: 'main.js.map',
      },
      cache: false,
      debug: true,
      devtool: 'source-map',
      stats: {
        colors: true,
        reasons: true,
      },
      plugins: [
        // new webpack.optimize.UglifyJsPlugin()
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              presets: [
                require.resolve('babel-preset-es2015'),
                require.resolve('babel-preset-stage-2'),
              ],
            },
          },
        ],
      },
    }), webpack)
    .pipe(gulp.dest('dist/'));
});

gulp.task('eslint', function() {
  return gulp.src(['src/*.js', 'src/*/*.js'])
    .pipe(eslint({
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
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


