/* jshint node: true */
'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace-task');
var fs = require('fs');
var g = require('gulp-load-plugins')({lazy: false});
var noop = g.util.noop;
var es = require('event-stream');
var queue = require('streamqueue');
var lazypipe = require('lazypipe');
var stylish = require('jshint-stylish');
var bower = require('./bower');
var mainBowerFiles = require('main-bower-files');
var historyApiFallback = require('connect-history-api-fallback');
var connect = require('gulp-connect');
var del = require('del');
var isWatching = false;
var gulpNgConfig = require('gulp-ng-config');
var rename = require('gulp-rename');

var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

var settings;
var config_file;

// If the app environment is not set, we default to development
var ENV = process.env.APP_ENV || 'development';
console.log("Running the app with APP_ENV set to "+ENV);
// Here, we use dotenv  to load our env vars in the .env, into process.env
if (ENV === 'production') {
  config_file = './config/config-prod.json';
} else {
  config_file = './config/config-dev.json';
  }

// Try to read frontend configuration file, fallback to default file
try {
  settings = JSON.parse(fs.readFileSync(config_file, 'utf8'));
} catch (error) {
  settings = JSON.parse(fs.readFileSync('./config/config_example.json', 'utf8'));
}

var configureSetup  = {
  wrap: true,
};

gulp.task('config', function() {
  gulp.src(config_file)
      .pipe(gulpNgConfig('kbitsApp.env', configureSetup))
      .pipe(rename('config.js'))
      .pipe(gulp.dest('app'));
});
/**
 * JS Hint
 */
gulp.task('jshint', function() {
  return gulp.src([
    './gulpfile.js',
    './app/**/*.js'
  ])
  .pipe(g.cached('jshint'))
  .pipe(jshint('./.jshintrc'))
  .pipe(livereload());
});

/**
 * CSS
 */
gulp.task('clean-css', function() {
  return gulp.src('./.tmp/css').pipe(g.clean());
});

gulp.task('styles', ['clean-css'], function() {
  return gulp.src([
    './app/**/*.css',
    '!./app/**/_*.css'
  ])
  .pipe(gulp.dest('./.tmp/css/'))
  .pipe(g.cached('built-css'))
  .pipe(livereload());
});

gulp.task('styles-dist', function() {
  return gulp.src([
      './app/**/*.css',
      '!./app/**/_*.css'
      ])
      .pipe(dist('css', bower.name, {rev: true}));
});

gulp.task('csslint', ['styles'], function() {
  return cssFiles()
    .pipe(g.cached('csslint'))
    .pipe(g.csslint('./.csslintrc'))
    .pipe(g.csslint.reporter())
  ;
});


/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function() {
  return appFiles().pipe(dist('js', bower.name, {ngAnnotate: true, rev: true}));
});

/**
 * Templates
 */
gulp.task('templates', function() {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function() {
  return templateFiles({min: true})
    .pipe(buildTemplates())
    .pipe(g.uglify())
    .pipe(g.rename({
       suffix: '.min'
     }))
    .pipe(gulp.dest('./dist'));
});

/**
 * Vendors
 */
gulp.task('vendors', function() {
  var opt = {
          overrides: {
                'jquery-ui': {
                    'ignore': false
                },
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/*.min.*',
                        './dist/fonts/*.*'
                    ]
                }
          },
          read: false};
  var bowerStream = mainBowerFiles(opt);

  return es.merge(
    gulp.src(bowerStream).pipe(g.filter('**/*.css')).pipe(dist('css', 'vendors')),
    gulp.src(bowerStream).pipe(g.filter('**/*.js')).pipe(dist('js', 'vendors'))
  );
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates'], index);

function index() {
  var opt = {
          overrides: {
                'jquery-ui': {
                    'ignore': false
                },
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/*.min.*',
                        './dist/fonts/*.*'
                    ]
                }
          },
          read: false};

  return gulp.src('./app/index.html')
    .pipe(g.inject(gulp.src(mainBowerFiles(opt)), {ignorePath: 'bower_components', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(es.merge(appFiles(), cssFiles(opt)), {ignorePath: ['.tmp', 'app']}))
    .pipe(g.embedlr())
    .pipe(replace({
      patterns: [
        {
          match: 'backendUrl',
          replacement: settings.CONSTANTS.backendUrl
        }
      ]
    }))
    .pipe(gulp.dest('./.tmp/'))
    .pipe(livereload())
  ;
}

/**
 * Assets
 */
gulp.task('assets', function() {
  return gulp.src('./app/images/**')
    .pipe(gulp.dest('./dist/images'))
  ;
});

/**
 * Partials
 */
gulp.task('partials', function() {
  return gulp.src('./app/layout/partials/**')
    .pipe(gulp.dest('./dist/partials'))
  ;
});

/**
 * Font Awesome Fonts
 */
gulp.task('fa-fonts', function() {
  return gulp.src('./bower_components/components-font-awesome/fonts/**')
    .pipe(gulp.dest('./dist/fonts'))
  ;
});

/**
 * Glyohicon Fonts
 */
gulp.task('gly-fonts', function() {
  return gulp.src('./bower_components/bootstrap/fonts/**')
    .pipe(gulp.dest('./dist/fonts'))
  ;
});

/**
 * Fonts
 */
gulp.task('fonts', ['fa-fonts','gly-fonts']);



gulp.task('clean:dist', function () {
  return del([
    './dist/' + bower.name + '-*.min.{js,css}'
  ]);
});

/**
 * Dist
 */
var transformJs = function (filepath, file, i, length) {
    return '<script src="' + filepath + '" defer></script>';
}
gulp.task('dist', ['clean:dist', 'config','vendors', 'assets', 'fonts', 'styles-dist', 'scripts-dist'], function() {
  return gulp.src('./app/index.html')
    .pipe(g.inject(gulp.src('./dist/vendors.min.css'), {
      ignorePath: 'dist',
      starttag: '<!-- inject:vendor:{{ext}} -->'
    }))
    .pipe(g.inject(gulp.src('./dist/vendors.min.js'), {
      ignorePath: 'dist',
      starttag: '<!-- inject:vendor:{{ext}} -->',
      transform: transformJs
    }))
    .pipe(g.inject(gulp.src('./dist/' + bower.name + '-*.min.css'), {ignorePath: 'dist'}))
    .pipe(g.inject(gulp.src('./dist/' + bower.name + '-*.min.js'), {ignorePath: 'dist', transform: transformJs}))
    .pipe(replace({
      patterns: [
        {
          match: 'backendUrl',
          replacement: settings.CONSTANTS.backendUrl
        }
      ]
    }))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest('./dist/'))
  ;
});

/**
 * Static file server
 */
gulp.task('statics', g.serve({
  port: settings.CONSTANTS.ports,
  hostname: settings.CONSTANTS.host,
  root: ['./.tmp', './app', './bower_components'],
  middleware: historyApiFallback({})
}));

/**
 * Production file server, note remember to run 'gulp dist' first!
 */
gulp.task('production', ['config','dist'], g.serve({
  port: settings.CONSTANTS.ports,
  hostname: settings.CONSTANTS.host,
  root: ['./dist'],
  middleware: historyApiFallback({})
}));

/**
 * Watch
 */
gulp.task('serve', ['config','watch']);

gulp.task('watch', ['statics', 'default'], function() {
  isWatching = true;

  // Initiate livereload server:
  g.livereload();

  gulp.watch('./app/**/*.js', ['jshint']).on('change', function(evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });

  gulp.watch('./app/index.html', ['index']);
  gulp.watch(['./app/**/*.html', '!./app/index.html'], ['templates']);
  gulp.watch(['./app/**/*.css'],['csslint']).on('change', function(evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint');

/**
 * Test
 */
gulp.task('test', ['templates'], function() {
  return testFiles()
    .pipe(g.karma({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }))
  ;
});

/**
 * Inject all files for tests into karma.conf.js
 * to be able to run `karma` without gulp.
 */
gulp.task('karma-conf', ['templates'], function() {
  return gulp.src('./karma.conf.js')
    .pipe(g.inject(testFiles(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false,
      transform: function(filepath, file, i, length) {
        return '  \'' + filepath + '\'' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'))
  ;
});

/**
 * Test files
 */
function testFiles() {
  return new queue({objectMode: true})
    .queue(gulp.src(mainBowerFiles()).pipe(g.filter('**/*.js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(appFiles())
    .queue(gulp.src('./app/**/*_test.js'))
    .done()
  ;
}

/**
 * All CSS files as a stream
 */
function cssFiles(opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles() {
  var files = [
    './.tmp/' + bower.name + '-templates.js',
    './app/**/*.js',
    '!./app/**/*_test.js'
  ];

  return gulp.src(files)
    .pipe(g.angularFilesort())
  ;
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles(opt) {
  return gulp.src(['./app/**/*.html', '!./app/index.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop())
  ;
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates() {
  return lazypipe()
    .pipe(g.ngHtml2js, {
      moduleName: bower.name + '-templates',
      prefix: '/' + bower.name + '/',
      stripPrefix: '/app'
    })
    .pipe(g.concat, bower.name + '-templates.js')
    .pipe(gulp.dest, './.tmp')
    .pipe(livereload)()
  ;
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist(ext, name, opt) {
  opt = opt || {};

  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
    .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(opt.rev ? g.rev : noop)
    .pipe(gulp.dest, './dist')()
  ;
}

/**
 * Livereload (or noop if not run by watch)
 */
 // gulp.task('livereload', function() {
 //    connect.server({
 //       livereload: true
 //   });
 // });

function livereload() {
  return lazypipe()
    .pipe(isWatching ? g.livereload : noop)()
//    .pipe(isWatching ? connect.server({livereload: true}) : noop)()

  ;
}

/**
 * Jshint with stylish reporter
 */
function jshint(jshintfile) {
  // Read JSHint settings, for some reason jshint-stylish won't work on initial load of files
  var jshintSettings = JSON.parse(fs.readFileSync(jshintfile, 'utf8'));

  return lazypipe()
    .pipe(g.jshint, jshintSettings)
    .pipe(g.jshint.reporter, stylish)()
  ;
}
