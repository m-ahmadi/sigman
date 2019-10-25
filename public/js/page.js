import tree from './tree/index.js';
import tv from './tv.js';

const inst = u.extend( newPubSub() );
	
function addCustomEvts() {
	
}


function beforeReady() {
	
}
async function onReady() {
	addCustomEvts();
	tree.init();
	await tv.init();
}

export default {
	beforeReady,
	onReady
}