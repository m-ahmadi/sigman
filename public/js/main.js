import tree from './tree/tree.js';
import tv from './tv.js';

$(async function () {
	
	await tree.init();
	tv.init();
	
});