import initSlider from './initSlider.js';
const { stringify: strify, parse } = JSON;

let $$;

let inst = {
  get $start() { return $$.start },
  get $end() { return $$.end }
};

function init(e) {
  // chart = e.chart;
  // bars = e.bars;
  $$ = __els('[data-root="zoomPanel"]');
  
  $$.root.draggable(); // handle: '.drag-handle'
  
  $$.zoomAllOut.on('click', zoomAllOut);
  $$.zoomTo.on('click', zoomTo);
  
  initSlider($$.slider[0], bars.length-1);
  $$.slider[0].noUiSlider.on('slide', function (values, handle) {
    const inputs = [$$.start, $$.end];
    inputs[handle].val( values[handle] );
    zoomTo();
  });
  // $$.slider[0].noUiSlider.on('end', zoomTo);
  $$.start.on('input blur change', function () {
    $$.slider[0].noUiSlider.set([this.value, null]);
  });
  $$.end.on('input blur change', function () {
    $$.slider[0].noUiSlider.set([null, this.value]);
  });
  $$.start.val(0);
  $$.end.val(bars.length-1);
  $$.grabFromChart.on('click', function () {
    const { from, to } = chart.getVisibleRange();
    const start = bars.findIndex(i => i.time >= from);
    const end   = bars.findIndex(i => i.time >= to);
    $$.start.val(start === -1 ? 0 : start).trigger('change');
    $$.end.val(end === -1 ? bars.length-1 : end).trigger('change');
  });
}

function zoomAllOut() {
  $$.start.val(0).trigger('change');
  $$.end.val(bars.length-1).trigger('change');;
  zoomTo();
}
function zoomTo() {
  chart.setVisibleRange({ from: bars[$$.start.val()].time, to: bars[$$.end.val()].time });
}

inst.init = init;
export default inst;