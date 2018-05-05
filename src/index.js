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


function addNewArticles(obj) {
  const { items } = obj;
  const itemsParent = document.getElementById('itemsList');
  console.log(items);
  const newItems = items.filter(item => !state.quidList.has(item.quid));
  console.log(newItems);
  newItems.forEach((item) => {
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
}


function updateFeed() {
  Promise.all(Array.from(state.urlList).map(getRss))
    .then(responses => responses.map(res => parseRss(res.data)))
    .then((parsedObjects) => {
      parsedObjects.map(addNewArticles);
      setTimeout(updateFeed, 5000);
    })
    .catch(() => {
      setTimeout(updateFeed, 20000);
    });
}
updateFeed();
$('#inputNewUrl').on('input', (e) => {
  const url = e.currentTarget.value;
  state.validate(url);
  updateFormData();
});
$('#mainAddButton').on('click', addNewUrl);
