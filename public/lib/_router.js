(function () {
  const routes = ['', 'page1', 'page2', 'not-found'];
  
  window.addEventListener('popstate', async function () {
    const { hash } = location;
    if (!hash) {
      location.replace('/stack8/public/#/');
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
      window._route = route;
      window.dispatchEvent(new CustomEvent('_route', {detail: route}));
      document.title = seg1[0].toUpperCase() + seg1.slice(1).toLowerCase();
    }
  });

  window.dispatchEvent(new Event('popstate'));
})();