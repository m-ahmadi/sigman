// $(function () {

// var widget = new TradingView.widget({
	// symbol: 'A',
	// interval: 'D',
	// timezone: "America/New_York",
	// container_id: "tv_chart_container",
	// locale: "ru",
	// datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
	// library_path: "js/lib/charting_library/"
// });


var widget = new TradingView.widget({
	symbol: "AMZN",
	width: "100%",
//	height: "300px",
	timeframe: "8M",
//	autosize: true,
	toolbar_bg: "hsla(233%,100$,55%,1)", 
	fullscreen: false,
	interval: "1D",
	container_id: "tv_chart_container",
	datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
	library_path: "js/lib/charting_library/",
	disabled_features: [
		//"header_widget",
		//"left_toolbar"
	],
	enabled_features: [
		"move_logo_to_main_pane"
	],
	overrides: {
		"mainSeriesProperties.style": 0
	}
});

widget.onChartReady(function() {
	
});


// });


