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
		this.YVal         = parseInt(row[17], 10);
	}
}
const types = [
	{ id: 1,   parent: '#', node: 'سهام عادی' },
	{ id: 300, parent: 1,   node: 'سهام' },
	{ id: 303, parent: 1,   node: 'آتیسی' },
	{ id: 309, parent: 1,   node: 'پایه' },
	{ id: 307, parent: 1,   node: 'تسهیلات فرابورس' },
	{ id: 313, parent: 1,   node: 'شرکتهای کوچک و متوسط' },
	{ id: 304, parent: 1,   node: 'آتی' },
	{ id: 311, parent: 1,   node: 'اختیار خرید' },
	{ id: 312, parent: 1,   node: 'اختیار فروش' },
	
	{ id: 2,   parent: '#', node: 'شاخص' },
	{ id: 68,  parent: 2,   node: 'شاخص' },
	{ id: 69,  parent: 2,   node: 'شاخص فرابورس' },
	{ id: 67,  parent: 2,   node: 'شاخص قیمت' },
	
	{ id: 3,   parent: '#', node: 'حق تقدم' },
	{ id: 400, parent: 3,   node: 'حق تقدم سهم' },
	{ id: 404, parent: 3,   node: 'حق تقدم پایه' },
	{ id: 403, parent: 3,   node: 'حق تقدم آتیسی' },
	
	{ id: 4,   parent: '#', node: 'اوراق مشاركت'},
	{ id: 306, parent: 4,   node: 'اوراق مشارکت آتیسی' },
	{ id: 208, parent: 4,   node: 'اوراق صكوك' },
	{ id: 706, parent: 4,   node: 'صکوک اختصاصی', alias: [70] },
	{ id: 200, parent: 4,   node: 'اوراق مشارکت انرژی' },
	{ id: 207, parent: 4,   node: 'اوراق مشارکت ارز صادراتی' },
	{ id: 301, parent: 4,   node: 'اوراق مشارکت' },
	{ id: 308, parent: 4,   node: 'اوراق مشارکت کالا' },
	
	{ id: 5,   parent: '#', node: 'صندوق سرمايه گذاري' },
	{ id: 305, parent: 5,   node: 'صندوق سرمايه گذاري در سهام بورس' },
	{ id: 315, parent: 5,   node: 'صندوق سرمایه گذاری قابل معامله انرژی' },
	
	{ id: 6,   parent: '#', node: 'اختیار' },
	{ id: 322, parent: 6,   node: 'اختیار خ اخزا (اسناد خزانه داری اسلامی)' },
	{ id: 323, parent: 6,   node: 'اختیارف اخزا (اسناد خزانه داری اسلامی)' },
	{ id: 321, parent: 6,   node: 'اختیار فولاد هرمزگان' },
	{ id: 601, parent: 6,   node: 'اختیار فروش تبعی (ذوب آهن اصفهان)' },
	{ id: 600, parent: 6,   node: 'اختیار فروش تبعی' },
	{ id: 602, parent: 6,   node: 'اختیار فروش تبعی فرابورس' },
	
	{ id: 903, parent: '#', node: 'دارایی فکری' },
	{ id: 701, parent: '#', node: 'گواهی سپرده کالایی' },
	{ id: 901, parent: '#', node: 'انرژی', alias: [902] },
	{ id: 801, parent: '#', node: 'سلف بورس انرژی', alias: [802,803,804] }
];

async function test() {
	let ins = await $.get('instruments.csv');
	ins = ins.split('\n').map(i => new Instrument(i));
	
	types.forEach(i => i.count = 0);
	ins.forEach(i => {
		const idx = types.findIndex( j => j.id === i.YVal || (j.alias && j.alias.includes(i.YVal)) );
		if (idx !== -1) types[idx].count += 1;
	});
	
	// count of categories
	dd = types.map(i => {
		let count = i.count;
		if (i.parent === '#') {
			const children = types.filter(j => j.parent === i.id);
			if (children.length) count = children.map(i=>i.count).reduce((a,c)=>a+c);
		}
		return Object.assign(i, { count });
	});
	// remove 0 counts
	dd = dd.filter(i => i.count !== 0);
	
	// merge 1-child categories:
	dd
		.filter(i => i.parent === '#' && dd.filter(j=>j.parent===i.id).length === 1)
		.map( i=> dd.findIndex(j=>j.id===i.id) )
		.forEach(i => {
			dd.find(j => j.parent === dd[i].id).parent = '#';
			dd.splice(i, 1);
		});
	// put child-less root-nodes at end:
	const childless = dd.filter(i => i.parent === '#' && !dd.filter(j=>j.parent===i.id).length);
	childless.map( i => dd.splice(dd.findIndex(j=>j.id===i.id), 1) );
	dd = dd.concat(childless);
	
	// types.filter((v,i,a) => v.parent === '#' && a.find(j=>j.parent === v.id) ) // categories
	// types.filter((v,i,a) => !a.find(j=>j.parent === v.id) ) // not category
	
	jd = dd.map(i => {
		return {
			id: ''+i.id,
			text: i.node + ` <small style="color:grey;">(${i.count})</small>`,
			parent: ''+i.parent,
			// state: { opened: true },
			...i.id === 300 && {state: { selected: true }},
			...i.parent !== '#' && {icon: 'jstree-file'}
		};
	});
	jd.filter(i => i.parent === '#' && !jd.filter(j=>j.parent===i.id).length).forEach(i => i.icon = 'jstree-file');
	
	$('#tree-container').jstree({
		core: { data: jd },
		plugins: ['checkbox', ''], // 'wholerow'
		types: { file: { icon: 'jstree-icon jstree-file', valid_children: ['none'] } }
	});
	
	var sd = types.map((v,i,a) => {
		if (v.parent === '#') return { text: v.node, children: a.filter(j=>j.parent === v.id).map(i=>i.node) }
	}).filter(i=>i); 
	
	const els = sd.map(i => {
		const optgroup = $('<optgroup>', {label: i.text});
		if (i.children.length) optgroup.append( i.children.map((v,i)=>$('<option>', {value: i}).html(v)) )
		return optgroup;
	});
	$('#select').append(els);
	$('#select').multiSelect({ selectableOptgroup: true });
	
	
	
}
test();






// });