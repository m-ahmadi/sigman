const { writeFileSync, readFileSync, readdirSync, statSync } = require('fs');
const { join, extname } = require('path');
const chokidar	 = require('chokidar');
const indent		 = require('indent.js');
const livereload = require('livereload');

const log = console.log;
const args = process.argv.slice(2);
colors();

if (args.length) {
  args.includes('html') ? runHtml() : undefined;
} else {
  watch('./html/**/*', runHtml);
  live();
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// html
function runHtml(globals={root: '.'}) {
  const srcdir			= './html';
  const outFile			= './public/index.html';
  const tempFile		= 'index.htm';
  const dataFileExt = '.htm';
  const tree = dirTree(srcdir, dataFileExt, tempFile);
  const html = parseAndRender(tree, {tempFile, dataFileExt, globals});
  if (!html) return;
  writeFileSync(outFile, indent.html(html, {tabString: '	'}), 'utf8');
  log('Ran html.'.green);
}
function parseAndRender(node, settings) {
  const dirs = getDirs(node);
  if (dirs.length) {
    dirs.forEach(k => {
      if (getDirs(node[k]).length) {
        node[k] = parseAndRender(node[k], settings);
      } else {
        // node[k] = render(node[k], settings);
        const rendered = render(node[k], settings);
        node[k] = () => rendered;
      }
    });
  }
  return render(node, settings);
}
function getDirs(node) {
  return Object.keys(node).filter(k => Object.prototype.toString.call(node[k]) === '[object Object]');
}
function render(node, settings) {
  const files			= Object.keys(node).filter( k => ['function','string'].includes(typeof node[k]) );
  const tempFile	= files.find(k => k === settings.tempFile);
  const dataFiles = files.filter(k => (!extname(k) || extname(k) === settings.dataFileExt) && k !== settings.tempFile);
  const g = settings.globals;
  let result = '';
  if (tempFile) {
    const context = dataFiles.reduce((a,c) => (a[c.replace(extname(c), '')] = node[c](g)) && a, {});
    result = node[tempFile](context, g);
  } else {
    result = dataFiles.reduce((a,c) => a += node[c](g)+'\n', '');
  }
  return result;
}
function dirTree(dir, dataFileExt, tempFile, tree={}) {
  readdirSync(dir).forEach(file => {
    const path = join(dir, file);
    if ( statSync(path).isDirectory() ) {
      tree[file] = {};
      dirTree(path, dataFileExt, tempFile, tree[file]);
    } else {
      tree[file] = extname(file) === dataFileExt && file !== tempFile
        ? eval("(g={}) => `"+ readFileSync(path, 'utf8') +"`") // ? readFileSync(path, 'utf8')
        : eval("(c={}, g={}) => `"+ readFileSync(path, 'utf8') +"`");
    }
  });
  return tree;
}
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
function watch(path, fn, init=true) {
  init && fn();
  const watcher = chokidar.watch(path).on('ready', () => {
    watcher
      .on('add',			 () => fn())
      .on('addDir',		 () => fn())
      .on('unlink',		 () => fn())
      .on('unlinkDir', () => fn())
      .on('change',		 () => fn());
    log('Watching...'.magentaB, path.whiteB);
  });
}
function colors() {
  [
    ['green',		 32],
    ['magentaB', 95],
    ['whiteB',	 97],
  ].forEach(([k, n]) => {
    String.prototype.__defineGetter__(k, function () {
      return `[${n}m${this}[0m`;
    });
  });
}