import axios from 'axios';
import { throttle, debounce } from 'lodash';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { getRefs } from './js/getRefs';
import { fetchPictures } from './js/fetchPictures';
import { onSuccess, onFailure } from './js/notifications';
import { renderMarkup } from './js/renderMarkup';

const { form, formButton, loadButton, galleryEl } = getRefs();
const input = form.elements.searchQuery;

form.addEventListener('submit', onSubmit);
input.addEventListener('input', onInput);
galleryEl.addEventListener('click', onClickShowModal);

let pageNum = 1;
let gallery = '';

function onSubmit(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.searchQuery.value.trim();
  fetchPictures(query).then(processQuery).catch(handleError);
}

function processQuery(r) {
  if (r.totalHits <= 0) {
    onFailure();
  } else {
    clearGallery();
    makeGallery(r.hits);
    gallery = new SimpleLightbox('.gallery a');
    onSuccess(r.totalHits);
    document.addEventListener('scroll', scrollSmooth);
  }
}

function handleError() {
  Notify.failure('Oops, something went wrong. Try again');
}

function makeGallery(arr) {
  galleryEl.insertAdjacentHTML('beforeend', renderMarkup(arr));
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function onInput() {
  if (input.value !== '') {
    enableButton();
  } else {
    disableButton();
  }
}

function enableButton() {
  formButton.disabled = false;
}

function disableButton() {
  formButton.disabled = true;
}

function onClickShowModal(e) {
  if (e.target === e.currentTarget) {
    console.log(`e.target === e.currentTarget`);
    return;
  }
  galleryEl.removeEventListener('click', onClickShowModal);
  gallery.on('show.simplelightbox');
}

function scrollSmooth() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

//   gallery.refresh(); при клике по кнопке погрузить еще
