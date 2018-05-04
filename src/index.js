import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import _ from 'lodash';
import genModal from './modal';
import parseRss from './parseRss';
import SiteState from './siteState';


const addButton = document.getElementById('mainAddButton');
// const updateButton = document.getElementById('mainUpdateButton');
// const formNewUrl = document.getElementById('formNewUrl');
const inputNewUrl = document.getElementById('inputNewUrl');
const state = new SiteState();

const generateArticle = (items) => {
  const itemsParent = document.getElementById('itemsList');
  for (let i = 0; i < items.length; i += 1) {
    const liForLinks = document.createElement('li');
    const a = document.createElement('a');
    a.innerHTML = items[i].itemtitle;
    a.href = items[i].link;
    liForLinks.append(a);
    const genId = _.uniqueId();
    liForLinks.append(genModal(genId));
    itemsParent.append(liForLinks);
    const { quid } = items[i];
    state.quidList.add(quid);
    $(`#ModalCenter${genId}`).on('show.bs.modal', (e) => {
      const modalBody = e.relatedTarget.nextElementSibling.querySelector('.modal-body');
      modalBody.textContent = items[i].itemdescription;
    });
  }
};

const generateFeed = (obj) => {
  const parent = document.getElementById('urlList');
  const li = document.createElement('li');
  li.innerHTML = obj.title;
  const div = document.createElement('div');
  div.innerHTML = obj.description;
  li.append(div);
  parent.append(li);
  generateArticle(obj.items);
};


const showError = (msg) => {
  const parent = addButton.parentNode;
  const warningDiv = document.createElement('div');
  warningDiv.innerHTML = msg;
  warningDiv.className = ('text-danger');
  parent.append(warningDiv);
  setTimeout(() => {
    parent.removeChild(warningDiv);
  }, 6000);
};

function addNewUrl() {
  if (state.formState === 'valid') {
    const url = inputNewUrl.value;
    parseRss(url)
      .then((parsedObj) => {
        generateFeed(parsedObj);
        state.addUrl(url);
        state.clearForm();
        inputNewUrl.value = '';
      })
      .catch((e) => {
        showError('ошибка загрузки!');
        state.alertError();
        console.log(e);
      });
  }
}

function isValid() {
  const url = this.value;
  state.validate(url);
  if (state.formState === 'invalid') {
    // formNewUrl.classList.add = ('has-error');
    this.style = 'box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 1px 8px rgba(255,0,0,.6)';
  } else {
    // formNewUrl.classList.remove = ('has-error');
    this.style = '';
  }
}
/* function addNewItems(doc) {
  const items = doc.getElementsByTagName('item');
  const itemsParent = document.getElementById('urlList');
  for (let i = 0; i < items.length; i += 1) {
    const quid = items[i].getElementsByTagName('guid')[0].innerHTML;
    console.log(quid);
    console.log(showedNews);
    if (!state.quidList.has(quid)) {
      itemsParent.prepend(generateLi(items[i]));
      console.log(items[i]);
    }
  }
}

function handlePaste(e) {
  const pastetext = e.clipboardData.getData('text/plain');
  if (this.value.length > 0) {
    if (!isURL(pastetext) || urlList.has(pastetext)) {
      this.style = 'box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 1px 8px rgba(255,0,0,.6)';
      this.dataset.status = 'invalid';
    } else {
      this.style = '';
      this.dataset.status = 'valid';
    }
  } else {
    this.dataset.status = 'none';
    this.style = '';
  }
}
function update() {
  Promise.all(Array.from(urlList).map(getxmlFromUrl))
    .then(xmls => xmls.map(el => domParser.parseFromString(el, 'application/xml')))
    .then(documents => documents.map(addNewItems))
    .catch(e => console.log(e));
}
*/
// inputNewUrl.addEventListener('paste', handlePaste);
// updateButton.addEventListener('click', update);

inputNewUrl.addEventListener('input', isValid);
addButton.addEventListener('click', addNewUrl);
