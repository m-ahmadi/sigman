import tse from './tse/tse.js';

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
		$('#clear-btn').on('click', () => chart.removeAllShapes() );
		
		window.chart = chart;
		window.bars = bars;
		window.tse = tse;
	});
	
}

function draw() {
	const rand = () => '#' + Math.random().toString(16).substr(-6);
	const _bars = tse.getPrices();
	const res = [];
	for (let i=0; i<_bars.length; i+=1) {
		const item = _bars[i];
		const found = _bars.slice(i, i+400).filter(j => j.low < item.low).length;
		if (!found) res.push(item.time);
	}
	// res.forEach( i => chart.createShape({ time: i }, { shape: 'arrow_down' }) );
	res.forEach( i => chart.createShape({ time: i }, { shape: 'icon', overrides: {icon: 0xf062, color: rand()} }) );
}

export default { init }