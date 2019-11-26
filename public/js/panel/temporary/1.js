const patterns = [
  function () { // most in-range occurrences
    const _bars = bars.slice($$.start.val(), $$.end.val());
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const highs = [];
    for (let i=0; i<_bars.length; i++) {
      const curr = _bars[i];
      const next = _bars[i+1];
      const prev = _bars[i-1];
      if (next && prev && curr.close > prev.close && curr.close > next.close) {
        highs.push( Object.assign({}, curr) );
      }
    }
    
    shapes[0] = [];
    const counts = highs.map((bar, i) => {
      const { close } = bar;
      const rest = highs.filter((v,j) => j !== i);
      const count = getInRangeBars(rest, close).length;
      return [count, i];
    })
    .sort( (a, b) => b[0]-a[0] )
    .reduce((acc, cur) => {
      const [count, index] = cur;
      if ( !acc[count] ) acc[count] = [];
      acc[count].push(index);
      return acc;
    }, {});
    
    let mostOccurredBars;
    let uniqAvgs;
    let uniqRanges;
    
    Object.keys(counts).map(parseFloat).filter(i=>i!==0).slice(-1).forEach(k => {
      mostOccurredBars = counts[k].map(i => highs[i]);
      
      uniqAvgs = mostOccurredBars.map(i => {
        const prices = getInRangeBars(highs, i.close).map(i => i.close);
        return Math.floor( prices.reduce((a,c)=>a+c) / (prices.length -1) );
      }).filter((v,i,a) => a.indexOf(v) === i);
      
      uniqRanges = uniqAvgs.map(i => {
        const rest = uniqAvgs.filter(j => j !== i);
        const inRangeEls =  rest.filter( j => isInRange(j, perc(i,-1), perc(i,1)) ); // get those that are in this element's range
        if (inRangeEls.length === 0) {
          return i;
        } else {
          inRangeEls.push(i);
          return Math.floor( (Math.min(...inRangeEls) + Math.max(...inRangeEls)) / 2 );
        }
      }).filter((v,i,a) => a.indexOf(v) === i);
      
      uniqRanges.forEach( price => shapes[0].push(createLine(price, 'max')) );
    });
    
    log(counts);
    
    mostOccurredBars = counts[12];
    var t0 = mostOccurredBars.map(i=>highs[i].close).map(i=>getInRangeBars(highs, i));
    var t = t0.map(i =>i.map(j=>j.close));
    var t1 = t.map(i=>Math.min(...i));
    var t2 = t.map(i=>Math.max(...i));
    var t3 = t.map(i=> percDiff(Math.min(...i), Math.max(...i)) );
    var t4 = t.map(i=> Math.max(...i) - Math.min(...i));
    var t5 = t.map(i=> i.reduce((a,c)=>a+c));
    var t6 = t.map(i=> i.reduce((a,c)=>a+c)).filter((v,i,a)=>a.indexOf(v)===i);
    var tx = t.map(i=> ({
      min: Math.min(...i),
      max: Math.max(...i),
      range: Math.max(...i) - Math.min(...i),
      percDiff: percDiff(Math.min(...i), Math.max(...i))
    }));
    
    log('===================================================================================', '\n');
    log('most occurred bars - index:', mostOccurredBars);
    log('most occurred bars - close:', mostOccurredBars.map(i=>highs[i].close) );
    log('most occurred bars - bars:', mostOccurredBars.map(i=>highs[i]) );
    log('inRange bars of each bar - bar:', t0);
    log('inRange bars of each bar - close:', t);
    log('inRange bars of each bar - min:', t1);
    log('inRange bars of each bar - max:', t2);
    log('inRange bars of each bar - percDiff:', t3);
    log('inRange bars of each bar - range:', t4);
    log('inRange bars of each bar - sum:', t5);
    log('inRange bars of each bar - uniq sum:', t6);
    
    window.highs = highs;
    window.counts = counts;
    window.mostOccurredBars = mostOccurredBars;
    window.allInRanges = allInRanges;
    window.uniqAvgs = uniqAvgs;
    window.uniqRanges = uniqRanges;
    window.t0 = t0;
    window.t = t;
    window.tx = tx;
  }
];

/*
sum of all counts
Object.keys(counts).map(i => counts[i].length).reduce((a,c)=>a+c)

bars with most occurrence
mostOccurredBars.map(i=>highs[i].close)
mostOccurredBars = counts[12].map(i => highs[i])

inRange bars of each bar

t = mostOccurredBars.map(i=>highs[i].close).map(i=>getInRangeBars(highs, i).map(i=>i.close))
[1809, 1823, 1790, 1795, 1790, 1821, 1826, 1820, 1810, 1826, 1817, 1827, 1796]
[2655, 2680, 2630, 2670, 2681, 2644, 2640, 2644, 2630, 2650, 2681, 2661, 2660]
[2655, 2626, 2630, 2670, 2619, 2644, 2640, 2644, 2626, 2630, 2650, 2661, 2660]
[2655, 2626, 2630, 2670, 2619, 2644, 2640, 2644, 2626, 2630, 2650, 2661, 2660]
[820, 819, 819, 815, 807, 808, 816, 821, 811, 808, 819, 822, 812]
[820, 819, 819, 815, 807, 808, 816, 821, 811, 808, 819, 822, 812]
[819, 819, 815, 807, 808, 816, 805, 811, 805, 802, 808, 819, 812]
[820, 819, 819, 815, 807, 808, 816, 805, 811, 805, 808, 819, 812]
max = Math.max(...t[0])
min = Math.min(...t[0])
percDiff(min, max)

t.map(i=>Math.max(...i))
[1827, 2681, 2670, 2670, 822, 822, 819, 820]

t.map(i=>Math.min(...i))
[1790, 2630, 2619, 2619, 807, 807, 802, 805]

t.map(i=> percDiff(Math.min(...i), Math.max(...i)) )
[2.07, 1.94, 1.95, 1.95, 1.86, 1.86, 2.12, 1.86]

t.map(i=> ({
  min: Math.min(...i),
  max: Math.max(...i),
  range:  Math.max(...i) - Math.min(...i)
}))

t.map(i=> i.reduce((a,c)=>a+c))
[23550, 34526, 34355, 34355, 10597, 10597, 10546, 10564]

t.map(i=> i.reduce((a,c)=>a+c)).filter((v,i,a)=>a.indexOf(v)===i)
[23550, 34526, 34355, 10597, 10546, 10564]

allInRanges.map(i=>highs[i].close).sort((a,b)=>a-b)
[802, 805, 807, 808, 811, 812, 815, 816, 819, 820, 821, 822, 1790, 1795, 1796, 1809, 1810, 1817, 1820, 1821, 1823, 1826, 1827, 2619, 2626, 2630, 2640, 2644, 2650, 2655, 2660, 2661, 2670, 2680, 2681]
*
