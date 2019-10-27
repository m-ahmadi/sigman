import Instrument from './tse/Instrument.js';

let awesomplete;
let data;

function findPathById(obj, id, path=[]) {
	let target = obj[id];
	path.push(target.text);
	if (target.parent === '#') {
		return path.reverse().join('/');
	} else {
		return findPathById(obj, target.parent, path)
	}
}
function search(obj, str) {
	let res = [];
	Object.keys(obj).forEach(k => {
		const prop = obj[k];
		if ( prop.text.includes(str) ) {
			res.push(prop.id);
		}
	});
	return res;
}


async function init() {
	const base = baseData;
	let ins = await $.get('data/instruments.csv');
	data = ins.split('\n').map(i => {
		const j = new Instrument(i);
		return `${j.Symbol} (${j.Name})`;
	});
	
	awesomplete = new Awesomplete('#myInput', {
		minChars: 2,
		maxItems: 20,
		list: []
	});

	$('#myInput').on('input', function (e) {
		const inpText = $(e.target).val();
		if (inpText.length > 1) {
			awesomplete.list = data.filter( i => i.includes(inpText) );
		}
	});

	$('#myInput').on('awesomplete-select', function (e) {
		const item = e.originalEvent.text.value;
		console.log(item);
	});

	$('#myInput').on('awesomplete-selectcomplete', function (e) {
		
	});
}


export default { init }