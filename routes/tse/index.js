const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const stringify = JSON.stringify;
const parse = JSON.parse;
const SEP = path.sep;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

const rq = require('./requests');
const convert = require('./convert');


router.get('/Instrument/:reload?', async function (req, res, next) {
	const filename = __dirname +SEP+'Instrument.json';
	if (req.params.reload) {
		let response = await rq.Instrument("20010321").catch(err => res.send(err.message) );
		let responseObject = xmljs.xml2js(response.data, {spaces: 4});
		let result = responseObject.elements[0].elements[0].elements[0].elements[0].elements[0].text;
		let converted = convert.Instrument.full(result);
		await writeFile(filename, stringify(converted.Instruments), 'utf8').catch(console.log);
	}
	
	// create file if doesn't exist
	await access(filename).catch(async err => {
		await writeFile(filename, '');
	});
	
	
	let instruments = await readFile(filename, 'utf8').catch(console.log);
	instruments = parse(instruments);
	// var converted = result.split(";");
	// var converted = convert.InstrumentAndShare.full(result);
	// var converted = convert.InstrumentAndShare.names(result);
	// var converted = convert.Instrument.full(instruments);
	// var converted = convert.Instrument.names(result);
	// var converted = convert.Instrument.symbols(result);
	// var converted = convert.Instrument.descriptions(result);
	
	res.send( instruments );
});


router.get('/closingPrices', async function (req, res, next) {
	const inscode = "gwAAAB+LCAAAAAAABADtvQdgHEmWJSYvbcp7f0r1StfgdKEIgGATJNiQQBDswYjN5pLsHWlHIymrKoHKZVZlXWYWQMztnbz33nvvvffee++997o7nU4n99//P1xmZAFs9s5K2smeIYCqyB8/fnwfPyLu7+zu7Ox8und/9+Bg79Pde/dHO6Odw729T/fv73368P6nDx58ev/hzj5/+un9g4N79N8ufX5wsH/vQD7dP9jfO7j34MEufUhAHgiEh/f3Hjw8uP/p3s7D/QOCxJ/u7x883N0/2NvZ+/Tg0wcH9+7h0/8HJUcds4MAAAA=";
	var response = await rq.DecompressAndGetInsturmentClosingPrice(inscode).catch(err => res.send(err.message) );
	var responseObject = xmljs.xml2js(response.data, {spaces: 4});
	var result = responseObject.elements[0].elements[0].elements[0].elements[0].elements[0].text;
	
	var instrumentsArrStr = result.split("@"); // each arr item: one instrument data
	
	// only first:
	var firstInstrument = instrumentsArrStr[0].split(";").map(eachRow);
	
	// or assume there's more than one:
	var instrumentsArrArrObj = instrumentsArrStr.map( i => i.split(";").map(eachRow) );
	
	// var converted = convert.Instrument.full(result);
	res.send( JSON.stringify(instrumentsArrStr) );
});


module.exports = router;