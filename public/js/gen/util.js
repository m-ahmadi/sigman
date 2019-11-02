export function randInt(min, max) {
	min = min ? Math.ceil(min) : 0;
	max = max ? Math.floor(max) : 10;
	return Math.floor(Math.random() * (max - min)) + min;
}

export function randColor() {
	return '#' + Math.random().toString(16).substr(-6);
}

export function splitArr(arr, size){
	return arr
		.map( (v, i) => i % size === 0 ? arr.slice(i, i+size) : undefined )
		.filter(i => i);
}