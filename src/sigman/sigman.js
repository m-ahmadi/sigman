import './sigman.scss';
import htm from './sigman.htm';

let $$;

export default function init() {
  __$routerOutlet.html(htm);
  
  $$ = __els('[data-root="sigman"]');

  /* $$.showUs.on('click', function () {
    $$.root.append( $(article) );
  }); */
}