// $(function () {
const log = console.log;
let bars;

let chart;
const japi = {};

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
	if (!bars) bars = await $.get('./api');
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










const widget = new TradingView.widget({
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


class Instrument {
	constructor(_row='') {
		const row = _row.split(',');
		
		if (row.length !== 18) throw new Error('Invalid Instrument data!');

		// unspecified ones are all string
		this.InsCode      = row[0];  // int64 (long)
		this.InstrumentID = row[1];
		this.LatinSymbol  = row[2];
		this.LatinName    = row[3];
		this.CompanyCode  = row[4];
		this.Symbol       = row[5];
		this.Name         = row[6];
		this.CIsin        = row[7];
		this.DEven        = row[8];  // int32 (int)
		this.Flow         = row[9];  // byte
		this.LSoc30       = row[10];
		this.CGdSVal      = row[11];
		this.CGrValCot    = row[12];
		this.YMarNSC      = row[13];
		this.CComVal      = row[14];
		this.CSecVal      = row[15];
		this.CSoSecVal    = row[16];
		this.YVal         = row[17];
	}
}
const types = {
	'67':  ['شاخص', 'شاخص قيمت']
	'68':  ['شاخص', 'شاخص']
	'69':  ['شاخص', 'شاخص فرابورس']
	'70':  ['اوراق مشاركت', 'صکوک اختصاصی']
	'200': ['اوراق مشاركت', 'اوراق مشارکت انرژی']
	'207': ['اوراق مشاركت', 'اوراق مشارکت ارز صادراتی']
	'208': ['اوراق مشاركت', 'اوراق صكوك']
	'300': ['سهام عادی', 'سهام']
	'301': ['اوراق مشاركت', 'اوراق مشارکت']
	'303': ['سهام عادی', 'اتیسی']
	'304': ['سهام عادی', 'آتی']
	'305': ['صندوق سرمايه گذاري', 'صندوق سرمايه گذاري در سهام بورس']
	'306': ['اوراق مشاركت', 'اوراق مشارکت اتیسی']
	'307': ['سهام عادی', 'تسهیلات فرابورس']
	'308': ['اوراق مشاركت', 'اوراق مشارکت کالا']
	'309': ['سهام عادی', 'پایه']
	'311': ['سهام عادی', 'اختیار خرید']
	'312': ['سهام عادی', 'اختیار فروش']
	'313': ['سهام عادی', 'شرکتهای کوچک و متوسط']
	'315': ['صندوق سرمايه گذاري', 'صندوق سرمایه گذاری قابل معامله انرژی']
	'321': ['اختیار فولاد هرمزگان', '']
	'322': ['اختیار خ اخزا ( اسناد خزانه داری اسلامی )', '']
	'323': ['اختیارف اخزا ( اسناد خزانه داری اسلامی )', '']
	'400': ['حق تقدم', 'حق تقدم سهم']
	'403': ['حق تقدم', 'حق تقدم اتیسی']
	'404': ['حق تقدم', 'حق تقدم پایه']
	'600': ['اختیار', 'اختیار فروش تبعی']
	'601': ['اختیار فروش تبعی ( ذوب آهن اصفهان)', '']
	'602': ['اختیار', 'اختیار فروش تبعی فرابورس']
	'701': ['کالا', 'گواهی سپرده کالایی']
	'706': ['اوراق مشاركت', 'صکوک اختصاصی']
	'801': ['سلف بورس انرژی', '']
	'802': ['سلف بورس انرژی', '']
	'803': ['سلف بورس انرژی', '']
	'804': ['سلف بورس انرژی', '']
	'901': ['انرژی', '']
	'902': ['انرژی', '']
	'903': ['دارایی فکری', 'دارایی فکری']
};

const uniq = [];
const uq = [];
async function test() {
	
	let ins = await $.get('instruments.csv');
	
	ins = ins.split('\n').map(i => new Instrument(i));
	ins.forEach(i => uniq.indexOf(i.YVal) === -1 ? uniq.push(i.YVal) : undefined);
	ins.forEach(i => uniq.indexOf(i.YVal) === -1 ? uniq.push(i.YVal) : undefined);
	// Object.keys(types).forEach(k => types[k][2] = 0);
	// ins.forEach(i => types[i.YVal] ? types[i.YVal][2] += 1 : undefined);
	
	
	log(types);
	var x = uniq.map(i => types[i] ? $('<optgroup>', {label: types[i][0]}) : undefined).filter(i => i);
	log(x);
	debugger
	$('#select').append(...x);
	$('#select').multiSelect({ selectableOptgroup: true });
	
}
test();






// });