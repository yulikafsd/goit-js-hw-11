export function getRefs() {
  return {
    form: document.querySelector('.search-form'),
    searchButton: document.querySelector('.form-button'),
    checkbox: document.querySelector('#toggle'),
    loadButton: document.querySelector('.load-more'),
    galleryEl: document.querySelector('div.gallery'),
    loader: document.querySelector('.loader'),
  };
}
