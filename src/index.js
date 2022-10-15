import axios from 'axios';
import { throttle, debounce } from 'lodash';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import markupTpl from './templates/markup.hbs';
import { getRefs } from './js/getRefs';
import { fetchPictures } from './js/fetchPictures';

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
    // document.addEventListener('scroll', scrollSmooth);
  }
}

function onSuccess(amount) {
  const images = amount !== 1 ? 'images' : 'image';
  Notify.success(`Hooray! We found ${amount} ${images}`);
}

function onFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function handleError() {
  Notify.failure('Oops, something went wrong. Try again');
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function makeGallery(arr) {
  galleryEl.insertAdjacentHTML('beforeend', markupTpl(arr));
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
