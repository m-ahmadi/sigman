const router = require('express').Router();
const fs = require('fs');
const { promisify } = require('util');
const jalaali = require('jalaali-js');
const { parse, stringify: strify } = JSON;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readFileIntoArray = require('./lib/readFileIntoArray');
const Day = require('./Day');

router.get('/', async function (req, res, next) {
	let file = await readFileIntoArray('data/ذوب.csv');
	file = file.slice(1).map(convert);
	
	res.send( file );
});

function convert(row) {
	const day = new Day(row);
	const s = day.date.toString(),
		y = parseInt( s.slice(0, 4) ),
		m = parseInt( s.slice(4, 6) ),
		d = parseInt( s.slice(6, 8) ),
		g = jalaali.toGregorian(y, m, d);
	return {
		// time: new Date( Date.UTC(y, m-1, d) ).setUTCHours(0,0,0,0) / 1000,
		time: Date.UTC(y, m-1, d) / 1000,
		open: day.open,
		high: day.high,
		low: day.low,
		close: day.last,
		volume: day.vol
	};
}



module.exports = router;