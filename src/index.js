import axios from 'axios';
import { throttle, debounce, ceil } from 'lodash';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import { getRefs } from './js/getRefs';
import { PicsApiService } from './js/api-service';
import markupTpl from './templates/markup.hbs';

const { form, searchButton, loadButton, galleryEl } = getRefs();
const input = form.elements.searchQuery;

form.addEventListener('submit', onSubmit);
input.addEventListener('input', onInput);
galleryEl.addEventListener('click', onClickShowModal);
loadButton.addEventListener('click', onLoadMore);

let gallery = '';

const picsApiService = new PicsApiService();

function onSubmit(event) {
  event.preventDefault();
  hideLoadButton();
  picsApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  picsApiService.resetPage();
  picsApiService.fetchPictures().then(handleSuccess).catch(handleError);
}

function handleSuccess(response) {
  if (response.totalHits <= 0) {
    onFailure();
  } else {
    clearGallery();
    makeGallery(response.hits);
    onSuccess(response.totalHits);
    picsApiService.lastPage = Math.ceil(
      response.totalHits / picsApiService.perPage
    );
    gallery = new SimpleLightbox('.gallery a');

    if (picsApiService.lastPage > 1) {
      showLoadButton();
    } else {
      hideLoadButton();
    }

    // document.addEventListener('scroll', scrollSmooth);
  }
}

function onFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onSuccess(amount) {
  const images = amount !== 1 ? 'images' : 'image';
  Notify.success(`Hooray! We found ${amount} ${images}`);
}

function handleError(error) {
  console.log(error);
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
    enableSearchButton();
  } else {
    disableSearchButton();
  }
}

function enableSearchButton() {
  searchButton.disabled = false;
}

function disableSearchButton() {
  searchButton.disabled = true;
}

function hideLoadButton() {
  loadButton.classList.add('is-hidden');
}

function showLoadButton() {
  loadButton.classList.remove('is-hidden');
}

function onClickShowModal(e) {
  if (e.target === e.currentTarget) {
    return;
  }
  galleryEl.removeEventListener('click', onClickShowModal);
  gallery.on('show.simplelightbox');
}

function onLoadMore() {
  if (picsApiService.lastPage === picsApiService.page) {
    hideLoadButton();
    window.onscroll = function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        Notify.warning(
          `We're sorry, but you've reached the end of search results`
        );
      }
    };
  }

  picsApiService
    .fetchPictures()
    .then(response => {
      const newGallery = makeGallery(response.hits);
      gallery.refresh();
      return newGallery;
    })
    .catch(handleError);
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
