import temp from './page1.htm';
import article from './article.htm';
import comp from './comp.js';

let $$;

export default function init() {
  $('#content').html(temp);
  
  $$ = __els('[data-root="page1"]');
  
  $$.showUs.on('click', function () {
    $$.root.append( $(article) );
  });
}