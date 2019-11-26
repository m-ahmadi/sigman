import { randColor, splitArr, isOdd, stepper } from '../gen/util.js';
import { initColorpick, destroyColorpick, getColor } from './colorpick.js';
import initSlider from './initSlider.js';
import { arrow, rect, line, horzline, text } from './shapes.js';

let $$, temps;
let chart;
let bars;

const shapes = {};
const log = console.log;

function init(e) {
  chart = e.chart;
  bars = e.bars;
  $$ = __els('[data-root="panel"]');
  temps = __temps('panel');
  
  $$.start.val(0);
  $$.end.val(bars.length-1); // bars.length
  
  
  // chart.removeAllShapes();
  $$.draw.on('click', draw);
  $$.clear.on('click', clear);
  $$.clearAll.on( 'click', () => {
    Object.keys(shapes).forEach(k => shapes[k] = []);
    chart.removeAllShapes()
  });
  $$.zoomOut.on('click', zoomOut);
  $$.zoomTo.on('click', zoomTo);
  // initSlider($$.slider[0], bars.length);
  
  $$.pattern.on('change', function (e) {
    const i = this.selectedIndex;
    $$.controlsContainer.empty();
    if ( !temps[i] ) return;
    $$.controlsContainer.html( temps[i]() );
    __els($$.controlsContainer, $$, true);
    inits[i]();
  }).trigger('change');
  
  setTimeout(() => {
    $$.pattern.prop({selectedIndex: 1}).trigger('change');
    draw();
  }, 500);
  window.$$ = $$;
  window.bars = bars;
}

function addCommonEvents() {
  $$.period.on('input blur change', function (e) {
  const el = $(this);
  const v = +el.val();
  const n =
    v < 3       ? 3   :
    v > 999     ? 999 :
    v % 2 === 0 ? v-1 :
    undefined;
  if (n !== undefined) el.val(n);
  });
  $$.distance.on('input blur change', function (e) {
    const el = $(this);
    const v = +el.val();
    const n =
      v < 0   ? 0   :
      v > 100 ? 100 :
      v === 0 ? 0   :
      undefined;
    if (n !== undefined) el.val(n);
  });
}

const inits = [
  function () { // most in-range occurrences
    $$.clear.off().on('click', function () {
      clear();
      $$.rangeList.empty();
    });
    if ($$.colorpicks.length) $$.colorpicks.each( (i, el) => destroyColorpick($(el)) );
    initColorpick($$.colorpick1, 'red');
    initColorpick($$.colorpick2, 'blue');
    initColorpick($$.colorpick3, 'cyan');
    initColorpick($$.colorpick4, '#9900ff');
    addCommonEvents();
    $$.rangeDistance.on('input blur change', function (e) {
      const el = $(this);
      const v = +el.val();
      const n =
        v < 0   ? 0   :
        v > 100 ? 100 :
        v === 0 ? 0   :
        undefined;
      if (n !== undefined) el.val(n);
    });
    
    
    $$.rangeList.on('change', function (e) {
      const val = $(this).val();
      shapes[0].forEach( i => chart.removeEntity(i) );
      shapes[0] = [];
      const colors = $$.colorpicks.map((i, el) => getColor($(el)) );
      const step = stepper(0, 3);
      val.forEach(i => {
        const rangeIndexes = JSON.parse(i);
        const rangeBars = rangeIndexes.map(idx => bars[idx]).sort((a,b) => a.time - b.time);
        
        const color = colors[step()];
        rangeBars.forEach(bar => {
          const { time, close } = bar;
          shapes[0].push(  arrow(time, close+20, color) );
        });
        
        const rangePrices = rangeBars.map(bar => bar.close);
        const avg = Math.floor(rangePrices.reduce((a,c)=>a+c) / rangePrices.length);
        const points = [
          { time: rangeBars[0].time, price: avg },
          { time: rangeBars[rangeBars.length-1].time, price: avg}
        ];
        shapes[0].push( line(points, color, 2) );
      });
    });
  },
  function () { // highs & count of in-range occurrences
    $$.start.val(270);
    $$.end.val(500);
    $$.countDistancePercent[0].checked = true
    if ($$.colorpick) destroyColorpick($$.colorpick);
    initColorpick($$.colorpick, 'red');
    addCommonEvents();
    $$.countList.on('change', function () {
      const val = $(this).val();
      shapes[0].forEach( i => chart.removeEntity(i) );
      shapes[0] = [];
      val.forEach(i => {
        const idxs = JSON.parse(i);
        const _bars = idxs.map(idx => bars[idx]).sort((a,b) => a.time - b.time);
      });
    });
  },
  function () { // highs
    $$.start.val(270);
    $$.end.val(500);
    if ($$.colorpicks.length) $$.colorpicks.each( (i, el) => destroyColorpick($(el)) );
    initColorpick($$.colorpick1, 'red');
    initColorpick($$.colorpick2, 'blue');
    initColorpick($$.colorpick3, '#ffe599');
    initColorpick($$.colorpick4, '#cc0000');
    addCommonEvents();
  },
  function () { // lows
    if ($$.colorpicks.length) $$.colorpicks.each( (i, el) => destroyColorpick($(el)) );
    initColorpick($$.colorpick1, 'blue');
    initColorpick($$.colorpick2, 'red');
    initColorpick($$.colorpick3, '#ffe599');
    initColorpick($$.colorpick4, '#cc0000');
    addCommonEvents();
  },
  function () { // local maxima
    initColorpick($$.colorpick1, 'red');
    initColorpick($$.colorpick2, 'blue');
  },
  function () { // dummy
    
  }
];

const patterns = [
  function () { // most in-range occurrences
    const _bars = bars.slice($$.start.val(), $$.end.val());
    const period = Math.floor(+$$.period.val() / 2);
    const distance = +$$.distance.val();
    const rangeDistance = +$$.rangeDistance.val();
    const colors = $$.colorpicks.map((i, el) => getColor($(el)) );
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const highs = getTurningPoints(_bars, period, distance);
    const counts = groupedInRangeCounts(highs);
    shapes[0] = [];
    counts.slice(-1).forEach(idxs => {
      const mostOccurredPrices = idxs.map(idx => highs[idx].close);
      const allInRangeIdxs = getAllInRanges(mostOccurredPrices, highs);
      const allInRangePrices = allInRangeIdxs.map(i=>highs[i].close);
      const ranges = getRanges(allInRangePrices, rangeDistance);
      
      const rangeIdxs = ranges.map(i => i.map( j => highs.findIndex(b=>b.close===j)) );
      const step = stepper(0, 3);
      rangeIdxs.forEach(idxs => {
        const bars = idxs.map(idx => highs[idx]).sort((a,b) => a.time - b.time);;
        const color = colors[step()];
        // const color = randColor();
        idxs.forEach(idx => {
          const { time, close } = highs[idx];
          shapes[0].push(  arrow(time, close+20, color) );
        });
        
        const prices = bars.map(j => j.close);
        const avg = Math.floor(prices.reduce((a,c)=>a+c) / prices.length);
        const points = [
          { time: bars[0].time, price: avg },
          { time: bars[bars.length-1].time, price: avg}
        ];
        shapes[0].push( line(points, color, 2) );
      });
      
      const selectOptions = rangeIdxs.map(idxs => {
        const rangeGlobalIdxs = idxs.map( idx => bars.findIndex(b => b.time === highs[idx].time) );
        const prices = rangeGlobalIdxs.map(i => bars[i].close).sort((a,b)=>a-b);
        const str = JSON.stringify(rangeGlobalIdxs);
        return $('<option>').val(str).text(prices.join(','));
      });
      $$.rangeList.empty().append( selectOptions.reverse() );
    });
  },
  function () { // highs & count of in-range occurrences
    const _bars = bars.slice($$.start.val(), $$.end.val());
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const period = Math.floor(+$$.period.val() / 2);
    const distance = +$$.distance.val();
    const countDistance = +$$.countDistance.val();
    const percent = $$.countDistancePercent[0].checked;
    const color = getColor($$.colorpick);
    const res = getTurningPoints(_bars, period, distance, undefined, false);
    shapes[1] = [];
    const counts = inRangeCounts(res, countDistance, percent);
    /* const groupedCounts = groupedInRangeCounts(res, countDistance, percent);
    const allInRanges = groupedCounts.map(idxs => {
      const prices = idxs.map(idx => res[idx].close);
      return getAllInRanges(prices, res);
    }); */
    res.forEach((bar, i) => {
      const { time, close } = bar;
      shapes[1].push( arrow(time, close+40, color) );
      shapes[1].push( text(time, close+130, counts[i], {bold:true, fontsize:20}) );
    });
  },
  function () { // highs
    const _bars = bars.slice($$.start.val(), $$.end.val());
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const period = Math.floor(+$$.period.val() / 2);
    const colors = $$.colorpicks.map((i, el) => getColor($(el)) );
    const distance = +$$.distance.val();
    shapes[2] = [];
    for (let i=0; i<_bars.length; i+=period) {
      const curr = _bars[i];
      const next = _bars[i+period];
      const prev = _bars[i-period];
      if (next && prev && curr.close > perc(prev.close, distance) && curr.close > perc(next.close, distance)) {
        // res.push(curr);
        shapes[2].push( arrow(curr.time, curr.close+40, colors[0]) );
        if ($$.guide[0].checked) {
          shapes[2].push( arrow(prev.time, prev.close-40, colors[1], true) );
          shapes[2].push( arrow(next.time, next.close-40, colors[1], true) );
          
          const sorted = sort([prev, next]);
          shapes[2].push(
            rect({time: sorted[0].time, channel: 'close'}, {time: sorted[1].time, price: curr.close}, colors[2], colors[3])
          );
        }
      }
    }
  },
  function () { // lows
    const _bars = bars.slice($$.start.val(), $$.end.val());
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const period = Math.floor(+$$.period.val() / 2);
    const colors = $$.colorpicks.map((i, el) => getColor($(el)) );
    shapes[3] = [];
    for (let i=0; i<_bars.length; i+=period) {
      const curr = _bars[i];
      const next = _bars[i+period];
      const prev = _bars[i-period];
      if (next && prev && curr.close < prev.close && curr.close < next.close) {
        shapes[3].push( arrow(curr.time, curr.close-50, colors[0], true) );
        if ($$.guide[0].checked) {
          shapes[3].push( arrow(prev.time, prev.close+40, colors[1]) );
          shapes[3].push( arrow(next.time, next.close+40, colors[1]) );
          
          const sorted = sort([prev, next]);
          shapes[3].push(
            rect({time: sorted[1].time, channel: 'close'}, {time: sorted[0].time, price: curr.close}, colors[2], colors[3])
          );
        }
      }
    }
  },
  function () { // local maxima
    // chart.setVisibleRange({ from: bars[0].time, to: bars[100].time });
    const chunks = splitArr(bars, 100);
    const colors = $$.colorpicks.map((i, el) => getColor($(el)) );
    const res = [];
    shapes[4] = [];
    for (let i=0; i<chunks.length; i++) {
      const chunk = chunks[i];
      const closePrices = chunk.map(i => i.close);
      const min = chunk.find( i => i.close === Math.min(...closePrices) );
      const max = chunk.find( i => i.close === Math.max(...closePrices) );
      res.push({ min, max });
      const points = [
        { time: chunk[0].time, price: max.close },
        { time: chunk[chunk.length-1].time , price: max.close }
      ];
      shapes[4].push( line(points, colors[1], 4) );
    }
    res.forEach(i => {
      const maxIdx = bars.findIndex(j => j.time === i.max.time);
      const minIdx = bars.findIndex(j => j.time === i.min.time);
      const pointA = { time: bars[maxIdx-10].time, price: i.max.close };
      const pointB = { time: bars[maxIdx+10].time, price: i.max.close };
      const points = [pointA, pointB];
      shapes[4].push( line(points, colors[0], 4) );
    })
  },
  function () { // dummy
    const res = [];
    for (let i=0; i<bars.length; i+=1) {
      const item = bars[i];
      const found = bars.slice(i, i+400).filter(j => j.low < item.low).length;
      if (!found) res.push(item.time);
    }
    // res.forEach( i => chart.createShape({ time: i }, { shape: 'arrow_down' }) );
    shapes[5] = res.map( i => arrow(i, undefined, randColor(), true, true) );
  }
];

/* const chunks = splitArr(_bars, 3);
 for (let i=0; i<chunks.length; i++) {
  const chunk = chunks[i];
  const prices = chunk.map(i => i.close);
  const first = prices[0];
  const middle = prices[ Math.floor(prices.length/2) ];
  const last = prices[prices.length-1];
  if (middle > first && middle > last) {
    res.push( chunk.find(i => i.close === middle) );
  }
} */
// const type = parseInt( $$.type.filter(':checked').val() );


// chart action
function draw() {
  patterns[ $$.pattern.val() ]();
}
function clear() {
  const idx = $$.pattern.val();
  const arr = shapes[idx];
  if (arr && arr.length) {
    arr.forEach( i => chart.removeEntity(i) );
    shapes[idx] = [];
  }
}
function zoomOut() {
  chart.setVisibleRange({ from: bars[0].time, to: bars[bars.length-1].time });
}
function zoomTo() {
  chart.setVisibleRange({ from: bars[$$.start.val()].time, to: bars[$$.end.val()].time });
}

// calcy
function sort(bars, asc=true, prop='close') {
  return bars.sort((a,b) => asc ? a[prop] - b[prop] : b[prop] - a[prop]);
}
function perc(n, percent) {
  return n + Math.floor((n/100) * percent);
}
function roundDown(n, d=0) {
  return parseFloat( Big(n).round(d, 0).toString() );
}
function percDiff(from, to) {
  const diff = to - from;
  const res = (diff / from) * 100;
  return roundDown(res, 2); // parseFloat( res.toFixed(2) );
}
function whatPerc(y, n) {
  // y is what percentage of n?
  const num = (y / n) * 100;
  return parseFloat( num.toFixed(2) );
}
function isInRange(n, min, max) {
  return n >= min && n <= max;
}
function getInRangeBars(bars, price, distance=1, percent=true, prop='close') {
  const min = percent ? perc(price, -distance) : price - distance;
  const max = percent ? perc(price, +distance) : price + distance;
  return bars.filter( i => isInRange(i[prop], min, max) );
}
function getRanges(nums, diff=1, percent=true) {
  const res = [];
  const len = nums.length;
  nums = nums.sort((a, b) => a - b);
  for (let i=0; i<len; i+=1) {
    const num = nums[i];
    const min = percent ? perc(num, -diff) : num - diff;
    const max = percent ? perc(num, +diff) : num + diff;
    const inRanges = nums.slice(i).filter( j => isInRange(j, min, max) );
    if (inRanges.length) {
      res.push(inRanges);
      i = nums.indexOf(inRanges[inRanges.length-1]);
    }
  }
  return res;
}
function getAllInRanges(prices, src, prop='close') {
  return prices
    .map( price => getInRangeBars(src, price) )                        // in range bars for each item:         [ [{},{},{}], [{},{},{}], ... ]
    .map( bars => bars.map(i => src.findIndex(j=>j[prop]===i[prop])) ) // replace bar with index of src array: [ [n, n, n],  [n, n, n],  ... ]
    .reduce((a,c) => a.concat(c), [])                                  // combine all items into one array:    [ n, n, n, n, n, n ]
    .filter((v,i,a) => a.indexOf(v) === i);                            // deduplicate
}
function getTurningPoints(bars=[], period=1, distance=1, low=false, percent=true, prop='close') {
  const len = bars.length;
  if (!len) return;
  const res = [];
  const comp = (n1, n2) => low ? n1 < n2 : n1 > n2;
  for (let i=0; i<len; i+=period) {
    const curr = bars[i];
    const prev = bars[i-period];
    const next = bars[i+period];
    if (!next || !prev) continue;
    const currN = curr[prop];
    const prevN = prev[prop];
    const nextN = next[prop];
    if (
      comp(currN, percent ? perc(prevN, distance) : prevN) &&
      comp(currN, percent ? perc(nextN, distance) : nextN)
    ) {
      res.push( Object.assign({}, curr) );
    }
  }
  return res;
}
function groupedInRangeCounts(bars, distance=1, percent=true, prop='close') {
  return bars.map((bar, i) => {
    const price = bar[prop];
    const rest = bars.filter((v,j) => j !== i);
    const count = getInRangeBars(rest, price, distance, percent, prop).length;
    return [count, i];
  })
  .sort( (a, b) => b[0]-a[0] )
  .reduce((acc, cur) => {
    const [count, index] = cur;
    if ( !acc[count] ) acc[count] = [];
    acc[count].push(index);
    return acc;
  }, []);
}
function inRangeCounts(bars, distance=1, percent=true, prop='close') {
  return bars.map((bar, i) => {
    const price = bar[prop];
    const rest = bars.filter((v,j) => j !== i);
    return getInRangeBars(rest, price, distance, percent, prop).length;
  });
}

export default { init 
