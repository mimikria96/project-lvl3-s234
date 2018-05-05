import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import _ from 'lodash';
import axios from 'axios';
import * as modal from './modal';
import parseRss from './parseRss';
import SiteState from './siteState';


const addButton = document.getElementById('mainAddButton');
// const updateButton = document.getElementById('mainUpdateButton');
const inputNewUrl = document.getElementById('inputNewUrl');
const state = new SiteState();

const formChangeMethods = {
  invalid: () => {
    inputNewUrl.className = 'form-control is-invalid';
  },
  valid: () => {
    inputNewUrl.className = 'form-control';
  },
  initial: () => {
    inputNewUrl.value = '';
  },
};

const updateFormData = () => {
  formChangeMethods[state.formState]();
};


const generateFeed = (obj) => {
  const parent = document.getElementById('urlList');
  const li = document.createElement('li');
  li.innerHTML = obj.title;
  const div = document.createElement('div');
  div.innerHTML = obj.description;
  li.append(div);
  parent.append(li);
  const itemsParent = document.getElementById('itemsList');
  itemsParent.append(modal.genModal());
  const { items } = obj;
  items.forEach((item) => {
    const liForLinks = document.createElement('li');
    const a = document.createElement('a');
    a.innerHTML = item.itemtitle;
    a.href = item.link;
    liForLinks.append(a);
    const id = _.uniqueId();
    liForLinks.append(modal.genButton(id));
    itemsParent.append(liForLinks);
    const { quid } = item;
    state.quidList.add(quid);
    $(`#ModalButton${id}`).on('click', () => {
      const modalBody = document.querySelector('#modal-body');
      modalBody.textContent = item.itemdescription;
    });
  });
};

const getRss = url => axios({
  method: 'get',
  url: `https://cors-anywhere.herokuapp.com/${url}`,
  responseType: 'text',
});

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
    getRss(url)
      .then(response => parseRss(response.data))
      .then((parsedObj) => {
        generateFeed(parsedObj);
        state.addUrl(url);
        state.resetFormState();
        updateFormData();
      })
      .catch(() => {
        showError('ошибка загрузки!');
        state.alertError();
      });
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

$('#inputNewUrl').on('input', (e) => {
  const url = e.currentTarget.value;
  state.validate(url);
  updateFormData();
});
addButton.addEventListener('click', addNewUrl);
