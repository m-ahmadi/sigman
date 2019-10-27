import tree from './tree/tree.js';
import tv from './tv.js';
import aweso from './aweso.js';

$(async function () {
	
	await tree.init();
	tv.init();
	aweso.init();
	
});