const fs = require("fs");
const router = require("express").Router();
const csv = require('csvtojson');
const jalaali = require('jalaali-js');



router.get("/", function (req, res, next) {
	// var a = fs.readFileSync("data/zob.csv", "utf8");
	
	csv().fromFile("data/zob.csv").then(jsonObj => {
		const newObj = jsonObj.map(convertData);
		res.send( newObj );
	});
});


function convertData(el) {
	const date = el["<DTYYYYMMDD>"],
		y = parseInt( date.slice(0, 4) ),
		m = parseInt( date.slice(4, 6) ),
		d = parseInt( date.slice(6, 8) ),
		g = jalaali.toGregorian(y, m, d);
	
	return {
		time: new Date(`${g.gy}/${g.gm}/${g.gd}`).getTime(),
		open: parseFloat( el["<OPEN>"] ),
		high: parseFloat( el["<HIGH>"] ),
		low: parseFloat( el["<LOW>"] ),
		close: parseFloat( el["<CLOSE>"] ),
		volume: parseInt( el["<VOL>"] ),
	};
}



module.exports = router;