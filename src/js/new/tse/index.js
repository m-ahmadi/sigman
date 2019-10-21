const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

const rq = require('./request.v2');

router.get('/Instrument/:reload?', async function (req, res, next) {
	if (req.params.reload) {
		let response = await rq.InstrumentAndShare().catch(err => res.send(err.message) );
		
	}
	res.send( instruments );
});

router.get('/closingPrices', async function (req, res, next) {
	res.send( JSON.stringify(instrumentsArrStr) );
});


module.exports = router;