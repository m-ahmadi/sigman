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
	fullscreen: false,
	interval: "1D",
	container_id: "tv_chart_container",
	datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
	library_path: "js/lib/charting_library/",
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


// });


