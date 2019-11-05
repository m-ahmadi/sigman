import tse from './tse/tse.js';
import { randColor, splitArr } from './gen/util.js';

let widget;
let bars;
let chart;
const japi = {};
const log = console.log;
const evt = newPubSub();

japi.onReady = function (callback) {
	// log('onReady()');
	const config = {
		exchanges: [
			{ value: '', name: 'All Exchanges', desc: '' }
		],
		symbolsTypes: [
			{name: 'All types', value: ''},
			{name: 'Stock', value: 'stock'},
			{name: 'Index', value: 'index'}
		],
		supportedResolutions: [ '1D' ],
		supports_time: true,
		supports_marks: false
	};
	setTimeout(callback, 0, config);
};

japi.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
	// log('resolveSymbol()');
	const symbolInfo = {
		name: symbolName,
		ticker: symbolName,
		description: 'zob ahan esfahan',
		session: '0830-1230:71234;7',
		timezone: 'Asia/Tehran' ,
		minmov: 1,
		pricescale: 1,
		force_session_rebuild: false,
		has_daily: true,
		supportedResolutions: ['D']
	};
	setTimeout(onSymbolResolvedCallback, 0, symbolInfo);
};

japi.getBars = async function (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
	// log('getBars()');
	const _bars = await getData(from, to).catch(log); // err => onErrorCallback(err) 
	if (_bars.length) {
		onHistoryCallback(_bars, {noData: false});
	} else {
		onHistoryCallback(_bars, {noData: true});
	}
};
async function getData(ferom, to) {
	if (!bars) bars = tse.getPrices();
	if (chart) chart.setVisibleRange({ from: bars[0].time, to: bars[bars.length-1].time });
	
	const subset = bars.filter(i => i.time >= ferom && i.time <= to);
	// subset.forEach(i => i.time *= 1000);
	// return subset;
	return subset.map( i => Object.assign({}, i, {time: i.time*1000}) );
}

japi.searchSymbols = function (userInput, exchange, symbolType, onResultReadyCallback) {
	// log('searchSymbols()');
	// log(userInput, exchange, symbolType, onResultReadyCallback);
};
japi.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
	// log('subscribeBars()');
	// log(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback);
};
japi.unsubscribeBars = function (subscriberUID) {
	// log('unsubscribeBars()');
	// log(subscriberUID);
};
japi.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack) {
	// log('calculateHistoryDepth()');
	// log(resolution, resolutionBack, intervalBack);
};
japi.getMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
	// log('getMarks()');
	// log(symbolInfo, from, to, onDataCallback, resolution);
};
japi.getTimescaleMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
	// log('getTimescaleMarks()');
	// log(symbolInfo, from, to, onDataCallback, resolution);
};
japi.getServerTime = function (callback) {
	// log('getServerTime()');
	// log(callback);
};



function init() {
	widget = new TradingView.widget({
			symbol: 'zob',
		// debug: true,
		fullscreen: true,
		// width: '70%',
		interval: '1D',
		container_id: 'tv_chart_container',
		timezone: 'Asia/Tehran',
		datafeed: japi,
		library_path: 'lib/tradingview/charting_library/',
		customFormatters: {
			dateFormatter: {
				format: function (date) {
					const faWeek = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
					const weekday = date.getDay();
					const j = jalaali.toJalaali(date);
					const jdate = `${j.jd}-${j.jm}-${j.jy}`;
					return faWeek[weekday] + ' ' + jdate;
				}
			}
		},
		disabled_features: [
			// 'header_widget',
			// 'left_toolbar',
			// 'context_menus', // timezone_menu, scales_context_menu, legend_context_menu, symbol_info, show_chart_property_page
			// 'show_chart_property_page',
	//		'remove_library_container_border',
	//		'border_around_the_chart',
			// 'edit_buttons_in_legend',
			'countdown',
			'display_market_status',
			// 'timeframes_toolbar',
			'go_to_date',
			'control_bar'
		],
		enabled_features: [
			'move_logo_to_main_pane'
		]
	});

	widget.onChartReady(function () {
		chart = widget.chart();
		// chart.removeAllShapes();
		$('#draw-btn').on('click', draw);
		$('#clear-btn').on('click', clear);
		$('#clear-all-btn').on( 'click', () => chart.removeAllShapes() );
		$('#zoomout-btn').on('click', zoomout);
		setTimeout(() => {
			// patterns[1]('orange');
			patterns[0]();
		}, 1000);
		window.chart = chart;
		window.bars = bars;
		window.tse = tse;
	});
	
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
const start = 170; // 174
const end = 300; // 247
const shapes = {};
window.inRange = inRange;
window.perc = perc;
const patterns = [
	function () {
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
		shapes[0] = [];
		res.forEach((bar, i) => {
			const { close } = bar;
			const n = 1;
			const rest = res.filter((v,j) => j !== i);
			// const found = rest.findIndex( j => inRange(j.close, perc(close, -n), perc(close, n)) ); // at least one other high in n% range
			// return found !== -1;
			bar.count = rest.filter( j => inRange(j.close, perc(close, -n), perc(close, n)) ).length;
			let id;
			id = chart.createShape({time: bar.time, price: bar.close+40}, { shape: 'icon', overrides: {icon: 0xf175, color: color(1)} }) // 0xf063
			shapes[0].push(id);
			id = chart.createShape({time: bar.time, price: bar.close+130}, { shape: 'text', overrides: {color: 'black', bold: true} });
			shapes[0].push(id);
			chart.getShapeById(id).setProperties({ text: bar.count });
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
		shapes[1] = res.map( i => chart.createShape({ time: i.time, price: i.close+40 }, { shape: 'icon', overrides: {icon: 0xf063, color: _color || color(1)} }) ); // 0xf175
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
		shapes[2] = res.map( i => chart.createShape({ time: i.time, price: i.close-40 }, { shape: 'icon', overrides: {icon: 0xf062, color: color(2)} }) ); // 0xf176
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
			shapes[3].push(shapeId);
		}
		
		shapes[3] = shapes[3].concat(res.map(i => {
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
		shapes[4] = res.map( i => chart.createShape({ time: i }, { shape: 'icon', overrides: {icon: 0xf062, color: randColor()} }) );
	}
];
function draw() {
	patterns[ $('#pattern').val() ]();
}
function clear() {
	const arr = shapes[ $('#pattern').val() ];
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
function inRange(n, min, max) {
	return n >= min && n <= max;
}

export default { init }