import tse from './tse/tse.js';
import colorpick from './colorpick.js';
import tree from './tree/tree.js';
import tv from './tv.js';
import aweso from './aweso.js';

$(async function () {
	await tse.init();
	colorpick.init();
	tree.init();
	tv.init();
	aweso.init();
});