const xmljs = require('xml-js');

const Instrument = require("./Instrument");
const InstrumentAndShare = require("./InstrumentAndShare");
const LastPossibleDeven = require("./LastPossibleDeven");
const DecompressAndGetInsturmentClosingPrice = require("./DecompressAndGetInsturmentClosingPrice");

const _Instrument = {};
const _InstrumentAndShare = {};
const _LastPossibleDeven = {};
const _DecompressAndGetInsturmentClosingPrice = {};

_Instrument.full = res => Instrument.full( extract(res) );
_Instrument.names = res => Instrument.names( extract(res) );
 
_InstrumentAndShare.full = res => InstrumentAndShare.full( extract(res) );
_InstrumentAndShare.names = res => InstrumentAndShare.names( extract(res) );

function extract(xmlResponse) {
	var responseObject = xmljs.xml2js(xmlResponse, {spaces: 4});
	var target = responseObject.elements[0].elements[0].elements[0].elements[0].elements[0].text;
	return target;
}

module.exports = {
	Instrument: _Instrument,
	InstrumentAndShare: _InstrumentAndShare,
	LastPossibleDeven: _LastPossibleDeven,
	DecompressAndGetInsturmentClosingPrice: _DecompressAndGetInsturmentClosingPrice
};