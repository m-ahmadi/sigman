// $(function () {
var chart;

var japi = {};
var config = {
	exchanges: [
		{ value: '', name: 'All Exchanges', desc: '' }
	],
	symbolsTypes: [
		{name: 'All types', value: ''},
		{name: 'Stock', value: 'stock'},
		{name: 'Index', value: 'index'}
	],
	supportedResolutions: [ '1D' ],
	supports_marks: true
};

// essential:
japi.onReady = function (callback) {
	// console.log('onReady()');
	setTimeout(callback, 0, config);
};

japi.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
	console.log('resolveSymbol()');
	
	var symbolInfo = {
		name: symbolName,
		ticker: symbolName,
		description: 'zob ahan esfahan',
		session: '0900-1230',
		timezone: 'Asia/Tehran' ,
		minmov: 1,
		pricescale: 1
	};
	setTimeout(onSymbolResolvedCallback, 0, symbolInfo);
};

japi.getBars = async function (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
	console.log('getBars()');
	const bars = await $.get('./api');
	onHistoryCallback(bars, {noData: false});
	
	/* if (bars.length) {
		onHistoryCallback(bars, {noData: false})
	} else {
		onHistoryCallback(bars, {noData: true})
	} */
};




// optional:
japi.searchSymbols = function (userInput, exchange, symbolType, onResultReadyCallback) {
	console.log('searchSymbols()');
	// console.log(userInput, exchange, symbolType, onResultReadyCallback);
};
japi.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
	console.log('subscribeBars()');
	// console.log(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback);
};
japi.unsubscribeBars = function (subscriberUID) {
	console.log('unsubscribeBars()');
	// console.log(subscriberUID);
};
japi.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack) {
	console.log('calculateHistoryDepth()');
	// console.log(resolution, resolutionBack, intervalBack);
};
japi.getMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
	console.log('getMarks()');
	// console.log(symbolInfo, from, to, onDataCallback, resolution);
};
japi.getTimescaleMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
	console.log('getTimescaleMarks()');
	// console.log(symbolInfo, from, to, onDataCallback, resolution);
};
japi.getServerTime = function (callback) {
	console.log('getServerTime()');
	// console.log(callback);
};










var widget = new TradingView.widget({
	symbol: 'zob',
	fullscreen: true,
	// width: '70%',
	interval: '1D',
	container_id: 'tv_chart_container',
//	datafeed: new Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
	datafeed: japi,
	library_path: 'lib/tradingview/charting_library/',
	disabled_features: [
		'header_widget',
		'left_toolbar',
		'context_menus', // timezone_menu, scales_context_menu, legend_context_menu, symbol_info, show_chart_property_page
		'show_chart_property_page',
//		'remove_library_container_border',
//		'border_around_the_chart',
		'edit_buttons_in_legend',
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

widget.onChartReady(function() {
	chart = widget.chart();
});


// });