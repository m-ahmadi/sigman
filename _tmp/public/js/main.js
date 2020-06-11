import tse from './tse/tse.js';
import tree from './tree/tree.js';
import tv from './tv.js';
import panel from './panel/panel.js';
import zoomPanel from './zoomPanel/zoomPanel.js';
import aweso from './aweso.js';

$(async function () {
  await tse.init();
  tree.init();
  tv.init();
  tv.once('bars_ready', e => {
    panel.init(e);
    zoomPanel.init();
  });
  aweso.init();
});