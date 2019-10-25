import csvParse from './gen/csvParse.js';
import Day from './tse/Day.js';

let widget;
let bars;
let chart;
const japi = {};
const log = console.log;

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
	const _bars = await getData(from, to).catch( err => onErrorCallback(err) );
	if (_bars.length) {
		onHistoryCallback(_bars, {noData: false})
	} else {
		onHistoryCallback(_bars, {noData: true})
	}
};
async function getData(ferom, to) {
	if (!bars) {
		// bars = await $.get('./api');
		const content = await $.get('data/ذوب.csv');
		bars = csvParse(content).slice(1).map(convert);
	}
	
	if (chart) chart.setVisibleRange({ from: bars[0].time, to: bars[bars.length-1].time });
	
	let subset = bars.filter(i => i.time >= ferom && i.time <= to);
	subset.forEach(i => i.time *= 1000);
	return subset;
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

function convert(row) {
	const day = new Day(row);
	const s = day.date.toString(),
		y = parseInt( s.slice(0, 4) ),
		m = parseInt( s.slice(4, 6) ),
		d = parseInt( s.slice(6, 8) ),
		g = jalaali.toGregorian(y, m, d);
	return {
		// time: new Date( Date.UTC(y, m-1, d) ).setUTCHours(0,0,0,0) / 1000,
		time: Date.UTC(y, m-1, d) / 1000,
		open: day.open,
		high: day.high,
		low: day.low,
		close: day.last,
		volume: day.vol
	};
}

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
			'show_chart_property_page',
	//		'remove_library_container_border',
	//		'border_around_the_chart',
			// 'edit_buttons_in_legend',
			'countdown',
			'display_market_status',
			'timeframes_toolbar',
			'go_to_date',
			'control_bar'
		],
		enabled_features: [
			'move_logo_to_main_pane'
		]
	});

	widget.onChartReady(function () {
		chart = widget.chart();
	});
}

export default { init }