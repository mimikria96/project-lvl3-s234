import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import parseRss from './parseRss';
import SiteState from './siteState';


const state = new SiteState();


const formChangeMethods = {
  invalid: () => {
    $('#inputNewUrl').addClass('is-invalid');
  },
  valid: () => {
    $('#inputNewUrl').removeClass('is-invalid');
  },
  initial: () => {
    $('#inputNewUrl').removeClass('is-invalid');
    $('#inputNewUrl').val('');
  },
  alertError: (err) => {
    const warningDiv = $('<p/>', { class: 'text-danger', text: err, id: 'error' });
    $('#mainAddButton').parent().append(warningDiv);
    setTimeout(() => {
      $('#error').remove();
    }, 6000);
  },
};

const updateFormData = (e) => {
  formChangeMethods[state.formState](e);
};

const generateButton = () => {
  const button = $('<button>', {
    type: 'button',
    'data-toggle': 'modal',
    'data-target': '#ModalCenter',
    class: 'btn btn-primary',
  }).text('Открыть описание');
  return button;
};

const generateArticles = (items) => {
  const itemsParent = $('#itemsList');
  items.forEach((item) => {
    const liForLinks = $('<li/>');
    const a = $('<a>', { href: item.link, html: item.itemtitle });
    const descrpt = $('<div/>', { html: item.itemdescription }).hide();
    liForLinks.append(a, '<br/>', generateButton(), descrpt);
    itemsParent.append(liForLinks);
    const { quid } = item;
    state.quidList.add(quid);
  });
};

const generateFeed = (obj) => {
  const parent = $('#urlList');
  const li = $('<li/>').html(`<strong>${obj.title}</strong>`);
  const div = $('<div/>').text(obj.description);
  li.append(div);
  parent.append(li);
  const { items } = obj;
  generateArticles(items);
};

const getRss = (url) => {
  const response = $.ajax({
    method: 'get',
    url: `https://cors-anywhere.herokuapp.com/${url}`,
    dataType: 'text',
    beforeSend: () => {
      $('#loading').show();
    },
    error: () => {
      $('#loading').hide();
    },
    complete: () => {
      $('#loading').hide();
    },
  });
  return response;
};
const addNewUrl = async () => {
  if (state.formState === 'valid') {
    try {
      const url = $('#inputNewUrl').val();
      const response = await getRss(url);
      const parsedRss = parseRss(response);
      generateFeed(parsedRss);
      state.addUrl(url);
      state.resetFormState();
      updateFormData();
    } catch (e) {
      state.alertError();
      updateFormData('Ошибка загрузки');
    }
  }
};


const addNewArticles = (obj) => {
  const { items } = obj;
  const newItems = items.filter(item => !state.quidList.has(item.quid));
  generateArticles(newItems);
};


const updateFeed = async () => {
  try {
    const responses = await Promise.all(Array.from(state.urlList)
      .map(url => $.ajax({ url: `https://cors-anywhere.herokuapp.com/${url}`, meethod: 'get', dataType: 'text' })));
    responses.map(res => addNewArticles(parseRss(res)));
    setTimeout(updateFeed, 5000);
  } catch (e) {
    setTimeout(updateFeed, 20000);
  }
};
updateFeed();

$('#ModalCenter').on('show.bs.modal', (event) => {
  const pressedBtn = $(event.relatedTarget);
  const content = pressedBtn.next().text();
  $('#modal-body').text(content);
});

$('#inputNewUrl').on('input', (e) => {
  const url = e.currentTarget.value;
  state.validate(url);
  updateFormData();
});
$('#mainAddButton').on('click', addNewUrl);
