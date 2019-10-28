export default class Day {
	constructor(_row='') {
		let row = _row.split(',');
		if (row.length !== 8) throw new Error('Invalid Day data!');
		row = row.map(i => /^[\d\.]+$/.test(i) ? parseInt(i) : i);
		
		this.date = row[0];
		this.open = row[2];
		this.high = row[3];
		this.low = row[4];
		this.last = row[5];
		this.close = row[6];
		this.vol = row[7];
		
		/* this.date = row[0];
		this.open = row[1];
		this.low = row[2];
		this.high = row[3];
		this.close = row[4];
		this.last = row[5];
		this.value = row[6];
		this.vol = row[7];
		this.count = row[8];
		this.yesterday = row[9]; */
		
		// ohlc4: (open + high + low + close) / 4
	}
}