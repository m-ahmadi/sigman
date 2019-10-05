const router = require('express').Router();
const fs = require('fs');
const { promisify } = require('util');
const jalaali = require('jalaali-js');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readFileIntoArray = require('./lib/readFileIntoArray');
const Day = require('./Day');

router.get('/', async function (req, res, next) {
	let file = await readFileIntoArray('data/zob.csv');
	
	res.send( file.slice(1).map(convert) );
});


function convert(row) {
	const day = new Day(row);
	const date = day.date.toString(),
		y = parseInt( date.slice(0, 4) ),
		m = parseInt( date.slice(4, 6) ),
		d = parseInt( date.slice(6, 8) ),
		g = jalaali.toGregorian(y, m, d);
	
	return {
		time: new Date(`${g.gy}/${g.gm}/${g.gd}`).getTime(),
		open: day.open,
		high: day.high,
		low: day.low,
		close: day.close,
		volume: day.vol
	};
}



module.exports = router;