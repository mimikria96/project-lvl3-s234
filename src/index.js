import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import $ from 'jquery';

const urlList = new Set();
const addButton = document.getElementById('mainAddButton');
// const divNewUrlArea = document.getElementById('addNewUrlArea');
const inputNewUrl = document.getElementById('inputNewUrl');
const domParser = new DOMParser();

const generateModal = (i) => {
  const parent = document.createElement('div');
  parent.classList.add('modal');
  parent.classList.add('fade');
  parent.id = `ModalCenter${i}`;
  parent.setAttribute('tabindex', '-1');
  parent.setAttribute('role', 'dialog');
  parent.setAttribute('aria-hidden', 'true');
  const modaldialog = document.createElement('div');
  modaldialog.classList.add('modal-dialog');
  modaldialog.setAttribute('role', 'document');
  const modalcontent = document.createElement('div');
  modalcontent.classList.add('modal-content');
  const modalheader = document.createElement('div');
  modalheader.classList.add('modal-header');
  const headerButton = document.createElement('button');
  headerButton.type = 'button';
  headerButton.classList.add('close');
  headerButton.setAttribute('data-dismiss', 'modal');
  headerButton.setAttribute('area-label', 'Close');
  const span = document.createElement('span');
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '&times;';
  const modalbody = document.createElement('div');
  modalbody.classList.add('modal-body');
  headerButton.append(span);
  modalheader.append(headerButton);
  modalcontent.append(modalheader);
  modalcontent.append(modalbody);
  modaldialog.append(modalcontent);
  parent.append(modaldialog);
  return parent;
};
const generateModalButton = (i) => {
  const button = document.createElement('button');
  button.classList.add('btn');
  button.classList.add('btn-primary');
  button.setAttribute('data-toggle', 'modal');
  button.setAttribute('data-target', `#ModalCenter${i}`);
  button.type = 'button';
  button.textContent = 'открыть описание';
  return button;
  // document.getElementById('itemsList').firstElementChild.append(button);
};
const generateHtml = (element) => {
  const parent = document.getElementById('urlList');
  const li = document.createElement('li');
  const channel = element.firstElementChild.firstElementChild;
  li.innerHTML = channel.firstElementChild.innerHTML;
  const div = document.createElement('div');
  div.innerHTML = channel.firstElementChild.nextElementSibling.innerHTML;
  li.append(div);
  parent.append(li);
  const items = channel.getElementsByTagName('item');
  const itemsParent = document.getElementById('itemsList');
  for (let i = 0; i < items.length; i += 1) {
    const liForLinks = document.createElement('li');
    const a = document.createElement('a');
    a.innerHTML = items[i].firstElementChild.innerHTML;
    a.href = items[i].firstElementChild.nextElementSibling.nextElementSibling.innerHTML;
    liForLinks.append(a);
    const genId = a.href.slice(a.href.length - 2);
    liForLinks.append(generateModalButton(genId));
    liForLinks.append(generateModal(genId));
    itemsParent.prepend(liForLinks);
    $(`#ModalCenter${genId}`).on('show.bs.modal', (e) => {
      const modalBody = e.relatedTarget.nextElementSibling.querySelector('.modal-body');
      modalBody.textContent = items[i].getElementsByTagName('description')[0].innerHTML;
    });
  }
};

function getxmlFromUrl(url) {
  return new Promise((resolve, rejected) => {
    axios({
      method: 'get',
      url: `https://cors-anywhere.herokuapp.com/${url}`,
      responseType: 'text',
    }).then(response => resolve(response.data))
      .catch(e => rejected(e));
  });
}

const loadContent = (url) => {
  getxmlFromUrl(url)
    .then(xml => domParser.parseFromString(xml, 'application/xml'))
    .then(document => generateHtml(document))
    .catch(error => console.log(error));
};

function addNewUrl() {
  if (inputNewUrl.dataset.status === 'valid') {
    urlList.add(inputNewUrl.value);
    loadContent(inputNewUrl.value);
    inputNewUrl.value = '';
    inputNewUrl.dataset.status = 'none';
  }
}

function isValid() {
  if (this.value.length > 0) {
    if (!isURL(this.value) || urlList.has(this.value)) {
      this.style = 'box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 1px 8px rgba(255,0,0,.6)';
      this.dataset.status = 'invalid';
    }
  } else {
    this.style = '';
    this.dataset.status = 'valid';
  }
}
function handlePaste(e) {
  const pastetext = e.clipboardData.getData('text/plain');
  if (!isURL(pastetext) || urlList.has(pastetext)) {
    this.style = 'box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 1px 8px rgba(255,0,0,.6)';
    this.dataset.status = 'invalid';
  } else {
    this.style = '';
    this.dataset.status = 'valid';
  }
}

inputNewUrl.addEventListener('keyup', isValid);
inputNewUrl.addEventListener('paste', handlePaste);
addButton.addEventListener('click', addNewUrl);
