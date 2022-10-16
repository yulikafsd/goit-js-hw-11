import 'simplelightbox/dist/simple-lightbox.min.css';
import { debounce } from 'lodash';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import { getRefs } from './js/getRefs';
import { FetchService } from './js/fetchService';
import markupTpl from './templates/markup.hbs';

//Constants:
const { form, searchButton, loadButton, galleryEl } = getRefs();
const input = form.elements.searchQuery;
let scrollHeight = '';

//Classes:
const lightbox = new SimpleLightbox('.gallery a');
const fetchService = new FetchService();

// Listeners:
input.addEventListener('input', debounce(onInput, 300));
form.addEventListener('submit', onSubmit);
loadButton.addEventListener('click', onLoadMore);

function onInput(e) {
  searchButton.disabled = e.target.value !== '' ? false : true;
}

function onSubmit(event) {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;
  fetchService.query = searchQuery.value.trim();

  if (!loadButton.classList.contains('is-hidden')) {
    hideLoadButton();
  }

  fetchService.resetPage();
  fetchService.fetchPictures().then(handleSuccess).catch(handleError);
}

function handleSuccess({ hits, totalHits }) {
  if (totalHits === 0) {
    notifyFailure();
  } else {
    fetchService.totalHits = totalHits;
    clearGallery();
    renderGallery(hits);
    notifySuccess(totalHits);

    if (fetchService.lastPage > 1) {
      showLoadButton();
    }
  }
}

function handleError(error) {
  console.log(error);
  Notify.failure('Oops, something went wrong. Try again');
}

function onLoadMore() {
  if (fetchService.lastPage === fetchService.page) {
    hideLoadButton();
    // notifyOnPageEnd();
  }

  fetchService
    .fetchPictures()
    .then(response => {
      return (newGallery = renderGallery(response.hits));
    })
    .catch(handleError);
}

// Button functions

function hideLoadButton() {
  loadButton.classList.add('is-hidden');
}

function showLoadButton() {
  loadButton.classList.remove('is-hidden');
}

// Notifications

function notifySuccess(amount) {
  const images = amount !== 1 ? 'images' : 'image';
  Notify.success(`Hooray! We found ${amount} ${images}`);
}

function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

// Gallery functions

function clearGallery() {
  galleryEl.innerHTML = '';
}

function renderGallery(arr) {
  galleryEl.insertAdjacentHTML('beforeend', markupTpl(arr));
  lightbox.refresh();
  scrollSmooth();
}

// Scroll functions

function scrollSmooth() {
  let distance = 0;

  if (fetchService.page === 2) {
    distance = galleryEl.firstElementChild.getBoundingClientRect().top;
  } else if (fetchService.page > 1) {
    distance = galleryEl.lastElementChild.getBoundingClientRect().height;
  }

  window.scrollBy({
    top: distance,
    behavior: 'smooth',
  });
}

function notifyOnPageEnd() {
  window.onscroll = function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      Notify.warning(
        `We're sorry, but you've reached the end of search results`
      );
    }
  };
}
