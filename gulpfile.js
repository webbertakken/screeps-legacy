var gulp          = require('gulp');
var webpackStream = require('webpackStream');
var webpack       = require('webpack');
var screeps       = require('gulp-screeps');
var eslint        = require('gulp-eslint');


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

gulp.task('eslint', function() {
  return gulp.src(['src/*.js', 'src/*/*.js'])
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
    } ))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('compile', ['eslint'], function() {
  return gulp.src('src/main.js')
    .pipe(gulpWebpack( {
      output: {
        filename: 'main.js',
        libraryTarget: 'commonjs2',
        sourceMapFilename: 'main.js.map',
      },
      cache: true,
      debug: true,
      devtool: 'source-map',
      stats: {
        colors: true,
        reasons: true,
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin()
      ],
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
    } ), webpack)
    .pipe(gulp.dest('dist/'));
});


