$(function () {


});


var widget = new TradingView.widget({
    fullscreen: true,
    symbol: 'AA',
    interval: 'D',
    toolbar_bg: '#f4f7f9',
    allow_symbol_change: true,
    container_id: "tv_chart_container",
    datafeed: new Datafeeds.UDFCompatibleDatafeed("http://demo_feed.tradingview.com"),
    library_path: "charting_library/",
    locale: "en",
    drawings_access: { type: 'black', tools: [ { name: "Trend Line" } ] },
    disabled_features: ["use_localstorage_for_settings", "volume_force_overlay"],
    enabled_features: ["move_logo_to_main_pane"],
    overrides: {
        "mainSeriesProperties.style": 0,
        "volumePaneSize": "tiny"
    },
    studies_overrides: {
        "bollinger bands.median.color": "#33FF88",
        "bollinger bands.upper.linewidth": 7
    },
    debug: true,
    time_frames: [
        { text: "50y", resolution: "6M" },
        { text: "1d", resolution: "5" },
    ],
    charts_storage_url: 'http://saveload.tradingview.com',
    client_id: 'tradingview.com',
    user_id: 'public_user',
    favorites: {
        intervals: ["1D", "3D", "3W", "1W", "1M"],
        chartTypes: ["Area", "Line"]
    }
});