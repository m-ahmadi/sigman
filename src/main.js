import './style.scss';
import './helpers.js';
import comp1 from './comp1/comp1.js';
import comp2 from './comp2/comp2.js';

import page1 from './page1/page1.js';
import page2 from './page2/page2.js';
import notfound from './not-found.js';

const pages = {page1, page2, 'not-found': notfound};

window.addEventListener('_route', function (e) {
  const route = e.detail;
  pages[route]();
});

$(async function () {
  if (window._route) pages[window._route]();
  
  await comp1.init();
  comp2.init();
});