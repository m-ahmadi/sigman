(function () {
  const routes = ['', 'page1', 'page2', 'sigman', 'not-found'];
  
  window.addEventListener('popstate', async function () {
    const { hash } = location;
    if (!hash) {
      location.replace('/sigman/public/#/');
      return;
    }
    console.log();
    const route = hash.slice(2);
    const seg1 = route.split('/')[0];
    
    if ( (hash && !/^#\//.test(hash)) || !routes.includes(seg1) ) {
      location.replace('#/not-found');
      return;
    }
    
    if (route) {
      window.__route = route;
      window.dispatchEvent(new CustomEvent('_route', {detail: route}));
      document.title = seg1[0].toUpperCase() + seg1.slice(1).toLowerCase();
    }
  });

  window.dispatchEvent(new Event('popstate'));
})();