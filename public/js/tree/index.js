import Instrument from '../tse/struct/Instrument.js';

let dd, jd;
async function test() {
	let ins = await $.get('data/instruments.csv');
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

function init() {
	$('#tree-container').jstree({
		core: { data: jd },
		plugins: ['checkbox', ''], // 'wholerow'
		types: { file: { icon: 'jstree-icon jstree-file', valid_children: ['none'] } }
	});
}

export default { init }