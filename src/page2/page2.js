import temp from './page2.htm';
import comp from './comp.js';

export default async function () {
  await comp.init();
  $('#content').html(temp);
}