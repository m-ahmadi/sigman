const fs = require('fs');
const parse = require('csv-parse/lib/sync');

//const content = fs.readFileSync(`../TseClient/${ticker.trim()}.csv`, 'utf8');
const content = fs.readFileSync(`../TseClient/${ticker.trim()}.csv`, 'utf8');
let parsed = parse(content);