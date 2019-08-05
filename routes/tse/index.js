const router = require('express').Router();
const xmljs = require('xml-js');

const rq = require('./requests');
const convert = require('./convert');

router.get('/', async function (req, res, next) {
	var response = await rq.Instrument("20010321").catch(err => res.send(err.message) );
	var responseObject = xmljs.xml2js(response.data, {spaces: 4});
	var result = responseObject.elements[0].elements[0].elements[0].elements[0].elements[0].text;
	
	// var converted = result.split(";");
	// var converted = convert.InstrumentAndShare.full(result);
	// var converted = convert.InstrumentAndShare.names(result);
	// var converted = convert.Instrument.full(result);
	// var converted = convert.Instrument.names(result);
	// var converted = convert.Instrument.symbols(result);
	var converted = convert.Instrument.descriptions(result);
	
	res.send( JSON.stringify(converted) );
});





module.exports = router;