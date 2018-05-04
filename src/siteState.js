import isURL from 'validator/lib/isURL';

export default class SiteState {
  constructor() {
    this.formState = 'initial';
    this.urlList = new Set();
    this.quidList = new Set();
  }
  validate(url) {
    if (url.length > 0) {
      if (!isURL(url) || this.urlList.has(url)) {
        this.formState = 'invalid';
      } else {
        this.formState = 'valid';
      }
    } else {
      this.formState = 'initial';
    }
  }
  addUrl(url) {
    this.urlList.add(url);
  }
  resetFormState() {
    this.formState = 'initial';
  }
  alertError() {
    this.formState = 'alertError';
  }
}
