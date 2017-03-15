// -----------------------------------------------------------------------------
//    ______   __    __  __        _______
//   /      \ /  |  /  |/  |      /       \
//  /$$$$$$  |$$ |  $$ |$$ |      $$$$$$$  |
//  $$ | _$$/ $$ |  $$ |$$ |      $$ |__$$ |
//  $$ |/    |$$ |  $$ |$$ |      $$    $$/
//  $$ |$$$$ |$$ |  $$ |$$ |      $$$$$$$/
//  $$ \__$$ |$$ \__$$ |$$ |_____ $$ |
//  $$    $$/ $$    $$/ $$       |$$ |
//   $$$$$$/   $$$$$$/  $$$$$$$$/ $$/
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// ES2015
//

"use strict";

// GULP AND SOME TOOLS
import gulp from "gulp";
import usage from"gulp-help-doc";
import gutil from "gulp-util";
import chalk from "chalk";
import notifier from "terminal-notifier";
import browserSync from "browser-sync";
import gulpSequence from "gulp-sequence";

// SASS
import sass from "gulp-sass";
import sassGlob from "gulp-sass-glob";
import prefix from "gulp-autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import scsslint from 'gulp-scss-lint';

// LOAD CONFIGURATION FILES
var config = require("./gulp.config.json");

// BOOT UP BROWSERSYNC
browserSync.create();


// -----------------------------------------------------------------------------
// GULP HELP -- https://www.npmjs.com/package/gulp-help-doc
// -----------------------------------------------------------------------------
gulp.task("help", () => usage(gulp))


// -----------------------------------------------------------------------------
// SCSS LINTING -- https://www.npmjs.com/package/gulp-scss-lint
// -----------------------------------------------------------------------------

/**
 * Scans the main theme SCSS files for errors
 * WARNING! This uses the scss_lint https://rubygems.org/gems/scss_lint
 * You can install this by executing: gem install scss_lint IF you have ruby installed
 *
 * @task {scss-lint}
 * @order {2}
 */
gulp.task("scss-lint", () => {
  gulp.src(config.path.src + "/**/*.scss")
    .pipe(scsslint());
});

// -----------------------------------------------------------------------------
// SASS -- https://www.npmjs.com/package/gulp-sass
// SASS GLOBBING -- https://www.npmjs.com/package/gulp-sass-glob
// -----------------------------------------------------------------------------

/**
 * Compiles your SCSS files to CSS
 *
 * @task {sass}
 * @order {2}
 */

gulp.task("sass",  () => {
  gulp.src(config.path.src + "/scss" + "/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      outputStyle: config.sass.style
    }))
    .on("error", function (err) {
      console.log(err);
      return this.emit("end");
    })
    .pipe(prefix(config.autoprefixer))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.path.dist + "/css"))
    .pipe(browserSync.stream());
});

// -----------------------------------------------------------------------------
// BROWSERSYNC SERVE -- http://www.browsersync.io/docs/gulp/
// -----------------------------------------------------------------------------

/**
 * Set up a server with BrowserSync and serves the sassdocs
 *
 * @task {serve}
 * @order {4}
 */
gulp.task("serve",() => {
  browserSync.init({
    server: "./",
    startPath: "dist/index.html"
  });
});

// -----------------------------------------------------------------------------
// WATCH
// -----------------------------------------------------------------------------

gulp.task("watch", () => {
  gulp.watch(config.path.src + "/scss" + "/**/*.scss", ["sass"]);
});

// -----------------------------------------------------------------------------
// DEFAULT GULP TASK - https://www.npmjs.com/package/gulp-sequence
// -----------------------------------------------------------------------------
gulp.task("default", gulpSequence(
    "help",
    "sass",
    "serve",
    "watch"
  )
);
