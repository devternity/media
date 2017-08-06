'use strict';

import gulp from "gulp"
import http from "http"
import mjml from "gulp-mjml"
import data from "gulp-data"
import pug from "gulp-pug2"
import del from "del"
import lr from "tiny-lr"
import fetch from "node-fetch"
import deploy from "gulp-gh-pages"
import ecstatic from "ecstatic"
import refresh from "gulp-livereload"
import embedlr  from "gulp-embedlr"
import mjmlEngine from "mjml"

const dir = {
    dest: './dist'
};

const httpPort = 5000;
const livereload = lr();
const livereloadPort = 35729;

gulp.task('clean', () => {
    return del([dir.dest]);
});


gulp.task('pug', () => {
    return gulp.src("./sources/**/*.pug")
		.pipe(data((file, callback) => {
			fetch('http://devternity.com/js/event.js')
			    .then(function(res) {
			    	return res.json();
			    })
			    .then(function(jsn) {
			    	return callback(undefined, jsn[0])
			    })
		}))
        .pipe(pug())
        .pipe(mjml(mjmlEngine, {minify: true}))
        // .pipe(embedlr())
        .pipe(gulp.dest(dir.dest))
        .pipe(refresh(livereload));
});



gulp.task('serve', () => {
    http.createServer(ecstatic({root: dir.dest})).listen(httpPort);
    livereload.listen(livereloadPort);
});

gulp.task('watch', () => {
  gulp.watch(["./sources/**/*.pug"], ['pug']);
});


gulp.task('deploy', function () {
    var options = {
        remoteUrl: "https://github.com/devternity/media.git",
        branch: "gh-pages"
    };
    return gulp.src(['./dist/**/*']).pipe(deploy(options));
});

gulp.task('build', ['pug']);
gulp.task('default', ['build', 'serve', 'watch']);

