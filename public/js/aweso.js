import tse from './tse/tse.js';

let awesomplete;
let data;

function findPathById(obj, id, path=[]) {
  let target = obj[id];
  path.push(target.text);
  if (target.parent === '#') {
    return path.reverse().join('/');
  } else {
    return findPathById(obj, target.parent, path)
  }
}
function search(obj, str) {
  let res = [];
  Object.keys(obj).forEach(k => {
    const prop = obj[k];
    if ( prop.text.includes(str) ) {
      res.push(prop.id);
    }
  });
  return res;
}


async function init() {
  const base = baseData;
  let ins = tse.getInstruments(true, true);
  data = ins.map(i => `${i.Symbol} (${i.Name})`);
  
  awesomplete = new Awesomplete('#aweso', {
    minChars: 2,
    maxItems: 20,
    list: [],
    /* item: function (text, input) {
      const highlighted = text.replace(new RegExp(input, 'ig'), `<mark>${input}</mark>`);
      return $.parseHTML(`<li>${highlighted}</li>`)[0];
    } */
  });

  $('#aweso').on('input', function (e) {
    const inpText = $(e.target).val();
    if (inpText.length > 1) {
      awesomplete.list = data.filter( i => i.includes(inpText) );
    }
  });

  $('#aweso').on('awesomplete-select', function (e) {
    const item = e.originalEvent.text.value;
    console.log(item);
  });

  $('#aweso').on('awesomplete-selectcomplete', function (e) {
    
  });
}


export default { init 
