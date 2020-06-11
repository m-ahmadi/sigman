let $$;
import temp from './comp1.htm';

function init () {
  $$ = __els('[data-root="comp1"]');
  
  $$.btn.on('click', function () {
    $$.root.append( $(temp) );
  });
}

export default { init }