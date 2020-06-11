allInRangeIdxs.forEach(idx => {
  const { time, close } = highs[idx];
  shapes[0].push( arrow(time, close+40, colors[0]) ); // shapes[0].push( text(time, close+150, ''+close) );
  
  if ($$.guide[0].checked) {
    const barIdx = _bars.findIndex(j=>j.time===time);
    const curr = _bars[barIdx];
    const prev = _bars[barIdx-period];
    const next = _bars[barIdx+period];
    shapes[0].push( arrow(prev.time, prev.close-40, colors[1], true) );
    shapes[0].push( arrow(next.time, next.close-40, colors[1], true) );
    const sorted = sort([prev, next]);
    shapes[0].push(
      rect({time: sorted[0].time, channel: 'close'}, {time: sorted[1].time, price: curr.close}, colors[2], colors[3])
    );
  }
});
const allInRangePrices = allInRangeIdxs.map(i=>highs[i].close);
const ranges = getRanges(allInRangePrices, rangeDistance);
const rangeAvgs = ranges.map( i => Math.floor(i.reduce((a,c)=>a+c) / i.length) ); // sum / count
rangeAvgs.forEach( price => shapes[0].push(horzline(price)) )
