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
		container_id: "tv_chart_container",
		datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
		library_path: "js/lib/charting_library/"
});

widget.onChartReady(function() {
	alert("hello world!");
});


// });


