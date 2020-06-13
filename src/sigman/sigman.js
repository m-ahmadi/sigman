import './sigman.scss';
import htm from './sigman.htm';

import datable from './datable/datable.js';

let $$;

export default function init() {
  __$routerOutlet.html(htm);
  
  $$ = __els('[data-root="sigman"]');
  
  datable.create($$.root);

  /* $$.showUs.on('click', function () {
    $$.root.append( $(article) );
  }); */
}