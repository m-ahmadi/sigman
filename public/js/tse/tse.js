import csvParse from '../gen/csvParse.js';
import Instrument from './Instrument.js';

let instruments;

function getInstruments(struct=false, arr=false) {
	const rows = csvParse(instruments);
	const res = arr ? [] : {};
	for (const row of rows) {
		const item = struct ? new Instrument(row) : row;
		if (arr) {
			res.push(item);
		} else {
			res[ row.match(/^\d+\b/)[0] ] = item;
		}
	}
	return res;
}

async function init() {
	instruments = await $.get('data/instruments.csv');
}

export default { init, getInstruments }