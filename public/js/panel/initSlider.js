const formatter = {
  from: value => value,
  to: value => Math.floor( parseFloat(value) )
};

export default function (el, max) {
  noUiSlider.create(el, {
    start: [0, max],
    connect: true,
    tooltips: [formatter, formatter],
    range: {
      min: 0,
      max
    },
    format: formatter
  });

