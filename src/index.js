import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';

function isValid() {
  if (!isURL(this.value)) {
    this.style = 'box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 1px 8px rgba(255,0,0,.6)';
    return;
  }
  this.style = 'box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)';
}
// const addButton = document.querySelector('#mainAddButton');
// const divNewUrlArea = document.querySelector('#addNewUrlArea');
const inputNewUrl = document.querySelector('#inputNewUrl');

inputNewUrl.addEventListener('click', isValid);
