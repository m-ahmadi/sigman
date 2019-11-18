import { randColor, splitArr, isOdd } from '../gen/util.js';
import initColorpick from './initColorpick.js';
import initSlider from './initSlider.js';

let $$;
let chart;
let bars;

const shapes = {};
const log = console.log;

function init(e) {
  chart = e.chart;
  bars = e.bars;
  $$ = __els('[data-root="panel"]');
  $$.start.val(0);
  $$.end.val(bars.length); // bars.length
  $$.period.val(61);
  $$.guide[0].checked = true;
  
  // chart.removeAllShapes();
  $$.draw.on('click', draw);
  $$.clear.on('click', clear);
  $$.clearAll.on( 'click', () => chart.removeAllShapes() );
  $$.zoomOut.on('click', zoomOut);
  $$.zoomTo.on('click', zoomTo);
  setTimeout(() => {
    $$.pattern[0].selectedIndex = 3;
    draw();
  }, 1500);
  
  initColorpick($$.colorpick1, 'red');
  initColorpick($$.colorpick2, 'blue');
  initColorpick($$.colorpick3, '#ffe599');
  initColorpick($$.colorpick4, '#cc0000');
  
  $$.period.on('input blur change', function (e) {
    const el = $(this);
    const v = +el.val();
    const n =
      v < 3       ? 3   :
      v > 999     ? 999 :
      v % 2 === 0 ? v-1 :
      0;
    if (n) el.val(n);
  });
  $$.distance.on('input blur change', function (e) {
    const el = $(this);
    const v = +el.val();
    const n =
      v < 0   ? 0   :
      v > 100 ? 100 :
      0;
    if (n) el.val(n);
  });
  window.$$ = $$;
  window.bars = bars;
}


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

const patterns = [
  function () { // most in-range occurrences
    const _bars = bars.slice($$.start.val(), $$.end.val());
    const period = Math.floor(+$$.period.val() / 2);
    const distance = +$$.distance.val();
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const highs = [];
    for (let i=0; i<_bars.length; i+=period) {
      const curr = _bars[i];
      const prev = _bars[i-period];
      const next = _bars[i+period];
      /* if (next && prev && curr.close > prev.close && curr.close > next.close) {
        highs.push( Object.assign({}, curr) );
      } */
      if (next && prev && curr.close > perc(prev.close, distance) && curr.close > perc(next.close, distance)) {
        highs.push( Object.assign({}, curr) );
      }
    }
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
    
    shapes[0] = [];
    Object.keys(counts).map(parseFloat).filter(i=>i!==0).slice(-1).forEach(k => {
      const mostOccurred = counts[k].map(i => highs[i].close);
      
      const allInRanges = mostOccurred
        .map( close => getInRangeBars(highs, close) )                        // in range bars for each item
        .map( bars => bars.map(i => highs.findIndex(j=>j.close===i.close)) ) // replace bar with index of highs array
        .reduce((a,c) => a.concat(c), [])                                    // combine all items into one array
        .filter((v,i,a) => a.indexOf(v) === i);                              // deduplicate
      
      allInRanges.forEach(idx => {
        const { time, close } = highs[idx];
        shapes[0].push( createArrow(time, close+40) );
        // shapes[0].push( createText(time, close+150, ''+close) );
        
        // expr
        if ($$.guide[0].checked) {
          const barIdx = _bars.findIndex(j=>j.time===time);
          const prev = _bars[barIdx-period];
          const next = _bars[barIdx+period];
          shapes[0].push( createArrow(prev.time, prev.close-40, true) );
          shapes[0].push( createArrow(next.time, next.close-40, true) );
        }
      });
      
      const nums = allInRanges.map(i=>highs[i].close).sort((a,b)=>a-b);
      const ranges = getRanges(nums, 1);
      /* ranges.forEach(i => {
        const avg = Math.floor(i.reduce((a,c)=>a+c) / i.length);
        shapes[0].push( createLine(avg, i.length) );
      }); */
      const rangeAvgs = ranges
        .map( i => [i.reduce((a,c)=>a+c), i.length] ) // [sum, count]
        .map( i => Math.floor(i[0] / i[1]) );
      
      rangeAvgs.forEach( price => shapes[0].push(createLine(price)) );
      
      window.ranges = ranges;
      window.rangeAvgs = rangeAvgs;
    });
    
    log(ranges);
    log(rangeAvgs);
    window.highs = highs;
    window.counts = counts;
  },
  function () { // highs & count of in-range occurrences
    const _bars = bars.slice($$.start.val(), $$.end.val());
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const period = Math.floor(+$$.period.val() / 2);
    const res = [];
    for (let i=0; i<_bars.length; i+=period) {
      const curr = _bars[i];
      const next = _bars[i+period];
      const prev = _bars[i-period];
      if (next && prev && curr.close > prev.close && curr.close > next.close) {
        res.push( Object.assign({}, curr) );
      }
    }
    shapes[1] = [];
    res.forEach((bar, i) => {
      const { close } = bar;
      const n = 1;
      const rest = res.filter((v,j) => j !== i);
      // const found = rest.findIndex( j => isInRange(j.close, perc(close, -n), perc(close, n)) ); // at least one other high in n% range
      // return found !== -1;
      const count = rest.filter( j => isInRange(j.close, perc(close, -n), perc(close, n)) ).length;
      let id;
      id = chart.createShape({time: bar.time, price: bar.close+40}, { shape: 'icon', overrides: {icon: 0xf175, color: color(1)} }) // 0xf063
      shapes[1].push(id);
      id = chart.createShape({time: bar.time, price: bar.close+130}, { shape: 'text', overrides: {color: 'black', bold: true} });
      shapes[1].push(id);
      chart.getShapeById(id).setProperties({ text: count });
    });
  },
  function () { // highs
    const _bars = bars.slice($$.start.val(), $$.end.val());
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const period = Math.floor(+$$.period.val() / 2);
    const distance = +$$.distance.val();
    shapes[2] = [];
    for (let i=0; i<_bars.length; i+=period) {
      const curr = _bars[i];
      const next = _bars[i+period];
      const prev = _bars[i-period];
      if (next && prev && curr.close > perc(prev.close, distance) && curr.close > perc(next.close, distance)) {
        // res.push(curr);
        shapes[2].push( createArrow(curr.time, curr.close+40) );
        if ($$.guide[0].checked) {
          shapes[2].push( createArrow(prev.time, prev.close-40, true) );
          shapes[2].push( createArrow(next.time, next.close-40, true) );
          
          const sorted = sort([prev, next]);
          shapes[2].push(
            createRect({time: sorted[0].time, channel: 'close'}, {time: sorted[1].time, price: curr.close})
          );
        }
      }
    }
  },
  function () { // lows
    const _bars = bars.slice($$.start.val(), $$.end.val());
    chart.setVisibleRange({ from: _bars[0].time, to: _bars[_bars.length-1].time });
    const period = Math.floor(+$$.period.val() / 2);
    shapes[3] = [];
    for (let i=0; i<_bars.length; i+=period) {
      const curr = _bars[i];
      const next = _bars[i+period];
      const prev = _bars[i-period];
      if (next && prev && curr.close < prev.close && curr.close < next.close) {
        shapes[3].push( createArrow(curr.time, curr.close-50, true) );
        if ($$.guide[0].checked) {
          shapes[3].push( createArrow(prev.time, prev.close+40) );
          shapes[3].push( createArrow(next.time, next.close+40) );
          
          const sorted = sort([prev, next]);
          shapes[3].push(
            createRect({time: sorted[1].time, channel: 'close'}, {time: sorted[0].time, price: curr.close})
          );
        }
      }
    }
  },
  function () { // local maxima
    // chart.setVisibleRange({ from: bars[0].time, to: bars[100].time });
    const chunks = splitArr(bars, 100);
    const res = [];
    if ( !Array.isArray(shapes[4]) ) shapes[4] = [];
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
      const shapeId = chart.createMultipointShape(points, { shape: 'extended', overrides: {linecolor: color(2), linewidth: 4, linestyle: 0} });
      shapes[4].push(shapeId);
    }
    
    shapes[4] = shapes[4].concat(res.map(i => {
      const maxIdx = bars.findIndex(j => j.time === i.max.time);
      const minIdx = bars.findIndex(j => j.time === i.min.time);
      const pointA = { time: bars[maxIdx-10].time, price: i.max.close };
      const pointB = { time: bars[maxIdx+10].time, price: i.max.close };
      const points = [pointA, pointB];
      return chart.createMultipointShape(points, { shape: 'extended', overrides: {linecolor: color(1), linewidth: 4, linestyle: 0} });
    }));
  },
  function () { // dummy
    const res = [];
    for (let i=0; i<bars.length; i+=1) {
      const item = bars[i];
      const found = bars.slice(i, i+400).filter(j => j.low < item.low).length;
      if (!found) res.push(item.time);
    }
    // res.forEach( i => chart.createShape({ time: i }, { shape: 'arrow_down' }) );
    shapes[5] = res.map( i => chart.createShape({ time: i }, { shape: 'icon', overrides: {icon: 0xf062, color: randColor()} }) );
  }
];


function draw() {
  patterns[ $$.pattern.val() ]();
}
function clear() {
  const arr = shapes[ $$.pattern.val() ];
  if (arr) arr.forEach( i => chart.removeEntity(i) );
}
function zoomOut() {
  chart.setVisibleRange({ from: bars[0].time, to: bars[bars.length-1].time });
}
function zoomTo() {
  chart.setVisibleRange({ from: bars[$$.start.val()].time, to: bars[$$.end.val()].time });
}
function rand() {
  return '#' + Math.random().toString(16).substr(-6);
}
function color(n) {
  return '#' + $$['colorpick'+n].spectrum('get').toHex();
}


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
function getInRangeBars(bars, price, n=1) {
  const min = perc(price, -n);
  const max = perc(price, +n);
  return bars.filter( j => isInRange(j.close, min, max) );
}
function getRanges(nums, range=1, percent=true) {
  const ranges = [];
  const len = nums.length;
  for (let i=0; i<len; i+=1) {
    const v = nums[i];
    const min = percent ? perc(v, -range) : v - range;
    const max = percent ? perc(v, +range) : v + range;
    const inRanges = nums.slice(i).filter( j => isInRange(j, min, max) );
    if (inRanges.length) {
      ranges.push(inRanges);
      i = nums.findIndex(j => j === inRanges[inRanges.length-1]);
    }
  }
  return ranges;
}

window.perc = perc;
window.whatPerc = whatPerc;
window.percDiff = percDiff;
window.isInRange = isInRange;
window.getInRangeBars = getInRangeBars;
window.getRanges = getRanges;



//shapes
function createArrow(time, price, up) {
  return chart.createShape({time, price}, { shape: 'icon', overrides: {icon: up ? 0xf176 : 0xf175, color: color(up ? 2 : 1)} }); // up=0xf062 down=0xf063
}
function createRect(p1, p2, _bgcolor, _color) {
  return chart.createMultipointShape([p1, p2], { shape: 'rectangle', overrides: {backgroundColor: _bgcolor || color(3), color: _color || color(4)} });
}
function createLine(price, text) {
  const id = chart.createShape({price}, { shape: 'horizontal_line', overrides: {linecolor: 'blue', linewidth: 1, showLabel: true, textcolor: 'black', fontsize: 20} });
  if (text) chart.getShapeById(id).setProperties({text});
  return id;
}
function createText(time, price, text) {
  const id = chart.createShape({time, price}, { shape: 'text', overrides: {color: 'black', bold: false, fontsize: 12} });
  chart.getShapeById(id).setProperties({ text: text });
  return id;
}

export default { init 
