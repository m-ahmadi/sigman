import { selectorExists } from '../gen/util.js';

const formatter = {
  from: value => value,
  to: value => Math.floor( parseFloat(value) )
};

export default function (el, max) {
  if ( !selectorExists('.noUi-active .noUi-tooltip') ) {
    $('body').append(`<style>
      .noUi-tooltip { display: none; }
      .noUi-active .noUi-tooltip { display: block; }
    </style>`);
  }
  
  noUiSlider.create(el, {
    start: [0, max],
    connect: true,
    behaviour: 'drag',
    tooltips: [formatter, formatter],
    range: {
      min: 0,
      max
    },
    format: formatter
  });
  
  return el;
}