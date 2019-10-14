export function randInt(min, max) {
	min = min ? Math.ceil(min) : 0;
	max = max ? Math.floor(max) : 10;
	return Math.floor(Math.random() * (max - min)) + min;
}