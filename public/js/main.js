$(function () {


var japi = {};
var config = {
	exchanges: [
		{ value: "", name: "All Exchanges", desc: "" }
	],
	symbolsTypes: [
		{name: "All types", value: ""},
		{name: "Stock", value: "stock"},
		{name: "Index", value: "index"}
	],
	supportedResolutions: [ "1D" ],
	supports_marks: true
};
// essential:
japi.onReady = function (callback) {
	setTimeout(callback, 0, config);
	console.log("onReady()");
};
japi.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
	
	console.log("resolveSymbol()");
	onSymbolResolvedCallback();
	
};

japi.getBars = function (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
	console.log("getBars()");
};
// optional:
japi.searchSymbols = function (userInput, exchange, symbolType, onResultReadyCallback) {
	console.log("searchSymbols()");
};
japi.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
	console.log("subscribeBars()");
};
japi.unsubscribeBars = function (subscriberUID) {
	console.log("unsubscribeBars()");
};
japi.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack) {
	console.log("calculateHistoryDepth()");
};
japi.getMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
	console.log("getMarks()");
};
japi.getTimescaleMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
	console.log("getTimescaleMarks()");
};
japi.getServerTime = function (callback) {
	console.log("getServerTime()");
};










var widget = new TradingView.widget({
	symbol: "AMZN",
	fullscreen: false,
	interval: "1D",
	container_id: "tv_chart_container",
//	datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
	datafeed: japi,
	library_path: "tradingview/charting_library/",
	disabled_features: [
		"header_widget",
		"left_toolbar",
		"context_menus", // timezone_menu, scales_context_menu, legend_context_menu, symbol_info, show_chart_property_page
		"show_chart_property_page",
//		"remove_library_container_border",
//		"border_around_the_chart",
		"edit_buttons_in_legend",
		"countdown",
		"display_market_status",
		"timeframes_toolbar",
		"go_to_date",
		"control_bar"
	],
	enabled_features: [
		"move_logo_to_main_pane"
	]
});

widget.onChartReady(function() {
	
});


});


