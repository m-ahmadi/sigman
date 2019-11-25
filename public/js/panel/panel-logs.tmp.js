// patt 0
window.rangeGlobalIdxs = rangeIdxs.map(idxs => idxs.map(idx => bars.findIndex(b => b.time === highs[idx].time)) );
window.mostOccurredPrices = mostOccurredPrices;
window.allInRangeIdxs = allInRangeIdxs;
window.ranges = ranges;
window.rangeIdxs = rangeIdxs;
window.rangeAvgs = rangeAvgs;

log('highs: ', highs);
log('counts: ', counts);
log('mostOccurredPrices: ', mostOccurredPrices);
log('allInRangeIdxs: ', allInRangeIdxs);
log('ranges: ', ranges);
log('rangeIdxs: ', rangeIdxs);
log('rangeGlobalIdxs: ', rangeGlobalIdxs);
log('rangeAvgs: ', rangeAvgs);
window.highs = highs;
window.counts = counts;

// globs
window.shapes = shapes;

window.perc = perc;
window.whatPerc = whatPerc;
window.percDiff = percDiff;
window.isInRange = isInRange;
window.getInRangeBars = getInRangeBars;
window.getRanges = getRanges;
window.getAllInRanges = getAllInRanges;
window.getTurningPoints = getTurningPoints;
window.countInRangesFull = countInRangesFull;
window.countInRangesBasic = countInRangesBasic
