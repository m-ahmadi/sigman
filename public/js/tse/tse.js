import csvParse from '../gen/csvParse.js';
import Instrument from './struct/Instrument.js';
import Day from './struct/Day.js';

let instruments;
let prices;

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

function getPrices() {
  return csvParse(prices).slice(1).map(rowToObj);
}

async function init() {
  prices = await $.get('data/ذوب.csv');
  instruments = await $.get('data/instruments.csv');
}

export default { init, getInstruments, getPrices }

function rowToObj(row) {
  const day = new Day(row),
  s = day.date.toString(),
  y = parseInt( s.slice(0, 4) ),
  m = parseInt( s.slice(4, 6) ),
  d = parseInt( s.slice(6, 8) );
  
  return {
    // time: new Date( Date.UTC(y, m-1, d) ).setUTCHours(0,0,0,0) / 1000,
    time: Date.UTC(y, m-1, d) / 1000,
    open: day.open,
    high: day.high,
    low: day.low,
    close: day.last,
    volume: day.vol
  };

