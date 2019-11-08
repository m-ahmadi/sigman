import { randColor, splitArr } from './gen/util.js';

let $$;
let chart;
let bars;

const start = 0; // 170 174
const end = 1620; // 300 247
const shapes = {};
const log = console.log;

function init(e) {
	chart = e.chart;
	bars = e.bars;
	$$ = __els('body');
	$$.start.val(start);
	$$.end.val(end);
	
	// chart.removeAllShapes();
	$$.draw.on('click', draw);
	$$.clear.on('click', clear);
	$$.clearAll.on( 'click', () => chart.removeAllShapes() );
	$$.zoomOut.on('click', zoomout);
	setTimeout(() => {
		// patterns[1]('orange');
		patterns[0]();
	}, 1500);
}

/* const chunks = splitArr(_bars, 3);
 for (let i=0; i<chunks.length; i++) {
	const chunk = chunks[i];
	const prices = chunk.map(i => i.close);
	const first = prices[0];
	const middle = prices[ Math.floor(prices.length/2) ];
	const last = prices[prices.length-1];
	if (middle > first && middle > last) {
		res.push( chunk.find(i => i.close === middle) );
	}
} */

const patterns = [
	function () { // most in-range occurrences
		const _bars = bars.slice($$.start.val(), $$.end.val());
		chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
		const highs = [];
		for (let i=0; i<_bars.length; i++) {
			const curr = _bars[i];
			const next = _bars[i+1];
			const prev = _bars[i-1];
			if (next && prev && curr.close > prev.close && curr.close > next.close) {
				highs.push( Object.assign({}, curr) );
			}
		}
		
		shapes[0] = [];
		const counts = highs.map((bar, i) => {
			const { close } = bar;
			const rest = highs.filter((v,j) => j !== i);
			const count = getInRangeBars(rest, close).length;
			return [count, i];
		})
		.sort( (a, b) => b[0]-a[0] )
		.reduce((acc, cur) => {
			const [count, index] = cur;
			if ( !acc[count] ) acc[count] = [];
			acc[count].push(index);
			return acc;
		}, {});
		
		let mostOccurredBars;
		let uniqAvgs;
		let uniqRanges;
		
		Object.keys(counts).map(parseFloat).filter(i=>i!==0).slice(-1).forEach(k => {
			mostOccurredBars = counts[k].map(i => highs[i]);
			mostOccurredBars.forEach((bar, i) => {
				console.log( getInRangeBars(highs, bar.close).map(i=>i.close) ); // redundant data
				getInRangeBars(highs, bar.close).forEach(i => {
					const id = chart.createShape({time: i.time, price: i.close+40}, { shape: 'icon', overrides: {icon: 0xf175, color: color(1)} }); // 0xf063
					shapes[0].push(id);
				});
			});
			uniqAvgs = mostOccurredBars.map(i => {
				const prices = getInRangeBars(highs, i.close).map(i => i.close);
				return Math.floor( prices.reduce((a,c)=>a+c) / (prices.length -1) );
			}).filter((v,i,a) => a.indexOf(v) === i);
			
			uniqRanges = uniqAvgs.map(i => {
				const rest = uniqAvgs.filter(j => j !== i);
				const inRangeEls =  rest.filter( j => isInRange(j, perc(i,-1), perc(i,1)) ); // get those that are in this element's range
				if (inRangeEls.length === 0) {
					return i;
				} else {
					inRangeEls.push(i);
					return Math.floor( (Math.min(...inRangeEls) + Math.max(...inRangeEls)) / 2 );
				}
			}).filter((v,i,a) => a.indexOf(v) === i);
			
			uniqRanges.forEach(i => {
				const id = chart.createShape({price: i}, { shape: 'horizontal_line', overrides: {linecolor: 'blue', linewidth: 1, showLabel: true, textcolor: 'black', fontsize: 20} });
				chart.getShapeById(id).setProperties({ text: 'max' });
				shapes[0].push(id);
			});
		});
		
		/*
		sum of all counts
		Object.keys(counts).map(i => counts[i].length).reduce((a,c)=>a+c)
		bars with most occurrence
		mostOccurredBars = counts[12].map(i => highs[i])
		
		sum of most occurred close prices
		mostOccurredBars.map(bar => getInRangeBars(highs, bar.close).map(i => i.close).reduce((a,c)=>a+c))
		sum of uniq most occurred close prices
		mostOccurredBars.map(bar => getInRangeBars(highs, bar.close).map(i => i.close).reduce((a,c)=>a+c)).filter((v,i,a)=>a.indexOf(v)===i)
		
		bars that share the specified range
		getInRangeBars(highs, highs[mostOccurredBars[0]].close).map(i => i.close)
		getInRangeBars(highs, highs[mostOccurredBars[1]].close).map(i => i.close)
			.reduce((a,c)=>a+c)
		*/
		log(counts);
		
		var _mostOccurredBars = counts[12];
		var _sharedRangeBars = getInRangeBars(highs, highs[_mostOccurredBars[0]].close).map(i => i.close)
		log('===================================================================================', '\n');
		log('most occurred bars:', _mostOccurredBars);
		log('bars that share a range:', _sharedRangeBars);
		
		
		window.highs = highs;
		window.counts = counts;
		window.mostOccurredBars = mostOccurredBars;
		window.uniqAvgs = uniqAvgs;
		window.uniqRanges = uniqRanges;
	},
	function () { // highs & count of in-range occurrences
		const _bars = bars.slice(start, end);
		chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
		let res = [];
		for (let i=0; i<_bars.length; i++) {
			const curr = _bars[i];
			const next = _bars[i+1];
			const prev = _bars[i-1];
			if (next && prev && curr.close > prev.close && curr.close > next.close) {
				res.push( Object.assign({}, curr) );
			}
		}
		shapes[1] = [];
		res.forEach((bar, i) => {
			const { close } = bar;
			const n = 1;
			const rest = res.filter((v,j) => j !== i);
			// const found = rest.findIndex( j => isInRange(j.close, perc(close, -n), perc(close, n)) ); // at least one other high in n% range
			// return found !== -1;
			const count = rest.filter( j => isInRange(j.close, perc(close, -n), perc(close, n)) ).length;
			let id;
			id = chart.createShape({time: bar.time, price: bar.close+40}, { shape: 'icon', overrides: {icon: 0xf175, color: color(1)} }) // 0xf063
			shapes[1].push(id);
			id = chart.createShape({time: bar.time, price: bar.close+130}, { shape: 'text', overrides: {color: 'black', bold: true} });
			shapes[1].push(id);
			chart.getShapeById(id).setProperties({ text: count });
		});
	},
	function (_color) { // highs
		const _bars = bars.slice(start, end);
		chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
		const res = [];
		for (let i=0; i<_bars.length; i++) {
			const curr = _bars[i];
			const next = _bars[i+1];
			const prev = _bars[i-1];
			if (next && prev && curr.close > prev.close && curr.close > next.close) {
				res.push(curr);
			}
		}
		shapes[2] = res.map( i => chart.createShape({ time: i.time, price: i.close+40 }, { shape: 'icon', overrides: {icon: 0xf063, color: _color || color(1)} }) ); // 0xf175
	},
	function () { // lows
		const _bars = bars.slice(start, end);
		chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
		const res = [];
		for (let i=0; i<_bars.length; i++) {
			const curr = _bars[i];
			const next = _bars[i+1];
			const prev = _bars[i-1];
			if (next && prev && curr.close < prev.close && curr.close < next.close) {
				res.push(curr);
			}
		}
		shapes[3] = res.map( i => chart.createShape({ time: i.time, price: i.close-40 }, { shape: 'icon', overrides: {icon: 0xf062, color: color(2)} }) ); // 0xf176
	},
	function () { // local maxima
		// chart.setVisibleRange({ from: bars[0].time, to: bars[100].time });
		const chunks = splitArr(bars, 100);
		const res = [];
		if ( !Array.isArray(shapes[3]) ) shapes[3] = [];
		for (let i=0; i<chunks.length; i++) {
			const chunk = chunks[i];
			const closePrices = chunk.map(i => i.close);
			const min = chunk.find( i => i.close === Math.min(...closePrices) );
			const max = chunk.find( i => i.close === Math.max(...closePrices) );
			res.push({ min, max });
			const points = [
				{ time: chunk[0].time, price: max.close },
				{ time: chunk[chunk.length-1].time , price: max.close }
			];
			const shapeId = chart.createMultipointShape(points, { shape: 'extended', overrides: {linecolor: color(2), linewidth: 4, linestyle: 0} });
			shapes[4].push(shapeId);
		}
		
		shapes[4] = shapes[4].concat(res.map(i => {
			const maxIdx = bars.findIndex(j => j.time === i.max.time);
			const minIdx = bars.findIndex(j => j.time === i.min.time);
			const pointA = { time: bars[maxIdx-10].time, price: i.max.close };
			const pointB = { time: bars[maxIdx+10].time, price: i.max.close };
			const points = [pointA, pointB];
			return chart.createMultipointShape(points, { shape: 'extended', overrides: {linecolor: color(1), linewidth: 4, linestyle: 0} });
		}));
	},
	function () { // dummy
		const res = [];
		for (let i=0; i<bars.length; i+=1) {
			const item = bars[i];
			const found = bars.slice(i, i+400).filter(j => j.low < item.low).length;
			if (!found) res.push(item.time);
		}
		// res.forEach( i => chart.createShape({ time: i }, { shape: 'arrow_down' }) );
		shapes[5] = res.map( i => chart.createShape({ time: i }, { shape: 'icon', overrides: {icon: 0xf062, color: randColor()} }) );
	}
];

function draw() {
	patterns[ $$.pattern.val() ]();
}
function clear() {
	const arr = shapes[ $$.pattern.val() ];
	if (arr) arr.forEach( i => chart.removeEntity(i) );
}
function zoomout() {
	chart.setVisibleRange({ from: bars[0].time, to: bars[bars.length-1].time });
}
function rand() {
	return '#' + Math.random().toString(16).substr(-6);
}
function color(n) {
	return '#' + $('#colorpick'+n).spectrum('get').toHex();
}
function perc(n, per) {
	return n + Math.floor((n/100) * per);
}
function isInRange(n, min, max) {
	return n >= min && n <= max;
}
function getInRangeBars(bars, price, n=1) {
	const min = perc(price, -n);
	const max = perc(price, n);
	return bars.filter( j => isInRange(j.close, min, max) );
}

window.perc = perc;
window.isInRange = isInRange;
window.getInRangeBars = getInRangeBars;


export default { init }