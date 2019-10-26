const gulp = require('gulp');
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// watching templates
const shell = require('gulp-shell');
const t = 'handlebars ./templates/template/ -f ./public/lib/_templates.js -e hbs -o';
const p = 'handlebars ./templates/partial/ -f ./public/lib/_partials.js -p -e hbs -o';

gulp.task( 'part', shell.task(p) );
gulp.task( 'temp', shell.task(t) );

gulp.task('temp-w', () => {
	gulp.watch( './templates/template/**', {ignoreInitial: false}, gulp.series('temp') );
});
gulp.task('part-w', () => {
	gulp.watch( './templates/partial/**', {ignoreInitial: false}, gulp.series('part') );
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// livereload
const livereload = require('gulp-livereload');
const h = './public/index.html';
const c = './public/css/**/*.css';
const j = './public/js/**/*.js';

gulp.task('live-html', cb => {
	gulp.src(h)
		.pipe( livereload() );
	cb();
});
gulp.task('live-css', cb => {
	gulp.src(c)
		.pipe( livereload() );
	cb();
});
gulp.task('live-js', cb => {
	gulp.src(j)
		.pipe( livereload() );
	cb();
});
gulp.task('live', () => {
	livereload.listen();
	
	gulp.watch( h, gulp.series('live-html') );
	gulp.watch( c, gulp.series('live-css') );
	gulp.watch( j, gulp.series('live-js') );
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@