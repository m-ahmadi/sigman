import tv from './tv.js';

const inst = u.extend( newPubSub() );
	
function addCustomEvts() {
	
}


function beforeReady() {
	
}
function onReady() {
	addCustomEvts();
	tv.init();
}

export default {
	beforeReady,
	onReady
}