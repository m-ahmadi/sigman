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
