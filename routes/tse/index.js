const router = require('express').Router();

const rq = require('./requests');
const convert = require('./convert');

router.get('/', async function (req, res, next) {
	var response = await rq.Instrument("20010321").catch(err => res.send(err.message) );
	var xml = response.data;
	
	// var converted = xml.split(";");
	// var converted = convert.InstrumentAndShare.full(xml);
	// var converted = convert.InstrumentAndShare.names(xml);
	// var converted = convert.Instrument.full(xml);
	var converted = convert.Instrument.names(xml);
	
	res.send( JSON.stringify(converted) );
});





module.exports = router;