import page from './page.js';
import csvParse from './gen/csvParse.js';
import Day from './tse/Day.js'; // 

page.beforeReady();

$(function () {
	page.onReady();

const log = console.log;



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

let dd, jd;
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


});















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