const formatter = {
  from: value => value,
  to: value => Math.floor( parseFloat(value) )
};

export default function (el) {
  noUiSlider.create(el, {
    start: [0, bars.length],
    connect: true,
    tooltips: [formatter, formatter],
    range: {
      min: 0,
      max: bars.length
    },
    format: formatter
  });
}
