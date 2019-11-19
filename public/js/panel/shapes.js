export function arrow(time, price, color, up=false) {
  const opts = {
    shape: 'icon',
    overrides: { icon: up ? 0xf176 : 0xf175, color }
  };
  return chart.createShape({time, price}, opts); // up=0xf062 down=0xf063
}

export function rect(p1, p2, bgcolor, color) {
  const opts = {
    shape: 'rectangle',
    overrides: {
      backgroundColor: bgcolor,
      color
      // linewidth: 4,
    }
  };
  return chart.createMultipointShape([p1, p2], opts);
}

export function line(price, text) {
  const opts = {
    shape: 'horizontal_line',
    overrides: {
      linecolor: 'blue',
      linewidth: 1,
      showLabel: true,
      textcolor: 'black',
      fontsize: 20
    }
  };
  const id = chart.createShape({price}, opts);
  if (text) chart.getShapeById(id).setProperties({text});
  return id;
}

export function text(time, price, text, _opts) {
  const opts = {
    shape: 'text',
    overrides: Object.assign({
      color: 'black',
      bold: false,
      fontsize: 12
    }, _opts)
  };
  const id = chart.createShape({time, price}, opts);
  chart.getShapeById(id).setProperties({ text: text });
  return id;
}
