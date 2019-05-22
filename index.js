const fs = require('fs');
const parse = require('csv-parse/lib/sync');

//const content = fs.readFileSync(`../TseClient/${ticker.trim()}.csv`, 'utf8');
const content = fs.readFileSync(`ذوب-ا.csv`, 'utf8');
let parsed = parse(content);

/*
	0           1       2       3      4       5        6
<DTYYYYMMDD>  <OPEN>  <HIGH>  <LOW>  <LAST>  <CLOSE>  <VOL>
*/

const len = parsed.length;
for (let i=0; i<len; i+=1) {
	const day = parsed[i],
	open = day[1],
	high = day[2],
	low = day[3],
	last = day[4],
	pp = (open + high + low + last) / 4;
	
	
}

parsed.forEach(day => {
	const open = day[1],
		high = day[2],
		low = day[3],
		last = day[4],
		pp = (open + high + low + last) / 4;
	
	
	
	
});