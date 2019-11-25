export function arrow(time, price, color, up=false, thick=false) {
  const upIcon   = thick ? 0xf062 : 0xf176;
  const downIcon = thick ? 0xf063 : 0xf175;
  const opts = {
    shape: 'icon',
    overrides: { icon: up ? upIcon : downIcon, color }
  };
  return chart.createShape({time, price}, opts);
}

export function line(points, color, width=1) {
  const opts = {
    shape: 'extended', // trend_line
    overrides: {
      linecolor: color,
      linewidth: width,
      linestyle: 0
    }
  };
  return chart.createMultipointShape(points, opts);
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

export function horzline(price, text) {
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
  chart.getShapeById(id).setProperties({text});
  return id;
}
