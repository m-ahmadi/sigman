import tree from './tree/index.js';
import tv from './tv.js';

const inst = u.extend( newPubSub() );
	
function addCustomEvts() {
	
}


function beforeReady() {
	
}
function onReady() {
	addCustomEvts();
	tree.init();
	tv.init();
}

export default {
	beforeReady,
	onReady
}