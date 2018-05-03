import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import $ from 'jquery';
import * as modal from './modal';


const urlList = new Set();
const showedNews = new Set();
const addButton = document.getElementById('mainAddButton');
const updateButton = document.getElementById('mainUpdateButton');
const inputNewUrl = document.getElementById('inputNewUrl');
const domParser = new DOMParser();
const id = () => `${Math.random().toString(36).substr(2, 9)}`;

const generateLi = (item) => {
  const liForLinks = document.createElement('li');
  const a = document.createElement('a');
  a.innerHTML = item.getElementsByTagName('title')[0].innerHTML;
  a.href = item.getElementsByTagName('link')[0].innerHTML;
  liForLinks.append(a);
  const genId = id();
  liForLinks.append(document.createElement('br'));
  liForLinks.append(modal.genButton(genId));
  liForLinks.append(modal.genModal(genId));
  $(`#ModalCenter${genId}`).on('show.bs.modal', (e) => {
    const modalBody = e.relatedTarget.nextElementSibling.querySelector('.modal-body');
    console.log(item.getElementsByTagName('description')[0].innerHTML);
    modalBody.textContent = item.getElementsByTagName('description')[0].innerHTML;
  });
  const quid = item.getElementsByTagName('guid')[0].innerHTML;
  showedNews.add(quid);
  return liForLinks;
};
const generateHtml = (element) => {
  const parent = document.getElementById('urlList');
  const li = document.createElement('li');
  const channel = element.firstElementChild.firstElementChild;
  li.innerHTML = channel.getElementsByTagName('title')[0].innerHTML;
  const div = document.createElement('div');
  div.innerHTML = channel.getElementsByTagName('description')[0].innerHTML;
  li.append(div);
  parent.append(li);
  const items = channel.getElementsByTagName('item');
  const itemsParent = document.getElementById('itemsList');
  for (let i = 0; i < items.length; i += 1) {
    const liForLinks = document.createElement('li');
    const a = document.createElement('a');
    a.innerHTML = items[i].getElementsByTagName('title')[0].innerHTML;
    a.href = items[i].getElementsByTagName('link')[0].innerHTML;
    liForLinks.append(a);
    const genId = id();
    liForLinks.append(document.createElement('br'));
    liForLinks.append(modal.genButton(genId));
    liForLinks.append(modal.genModal(genId));
    itemsParent.prepend(liForLinks);
    $(`#ModalCenter${genId}`).on('show.bs.modal', (e) => {
      const modalBody = e.relatedTarget.nextElementSibling.querySelector('.modal-body');
      modalBody.textContent = items[i].getElementsByTagName('description')[0].innerHTML;
    });
    const quid = items[i].getElementsByTagName('guid')[0].innerHTML;
    showedNews.add(quid);
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
function addNewItems(doc) {
  const items = doc.getElementsByTagName('item');
  const itemsParent = document.getElementById('urlList');
  for (let i = 0; i < items.length; i += 1) {
    const quid = items[i].getElementsByTagName('guid')[0].innerHTML;
    console.log(quid);
    console.log(showedNews);
    if (!showedNews.has(quid)) {
      itemsParent.prepend(generateLi(items[i]));
      console.log(items[i]);
    }
  }
}

function isValid() {
  if (this.value.length > 0) {
    if (!isURL(this.value) || urlList.has(this.value)) {
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

inputNewUrl.addEventListener('keyup', isValid);
inputNewUrl.addEventListener('paste', handlePaste);
addButton.addEventListener('click', addNewUrl);
updateButton.addEventListener('click', update);
