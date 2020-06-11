const { join } = require('path');
const livereload = require('livereload');

const log = console.log;

colors();
live();

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// livereload
function live() {
  const lrserver = livereload.createServer();
  
  lrserver.watch(
    [
      'public/index.html',
      'public/**/*.css',
      'public/**/*.js',
      'public/lib/_*'
    ].map( i => join(__dirname, i) )
  );
  log('livereload started...'.magentaB);
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// util
function colors() {
  [
    ['magentaB', 95],
    ['whiteB',   97],
  ].forEach(([k, n]) => {
    String.prototype.__defineGetter__(k, function () {
      return `[${n}m${this}[0m`;
    });
  });
}