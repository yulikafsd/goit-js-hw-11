import 'simplelightbox/dist/simple-lightbox.min.css';
import { debounce, throttle } from 'lodash';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import { getRefs } from './js/getRefs';
import { FetchService } from './js/fetchService';
import markupTpl from './templates/markup.hbs';

//Constants:
const { form, searchButton, loadButton, galleryEl, loader } = getRefs();
const input = form.elements.searchQuery;

//Classes:
const lightbox = new SimpleLightbox('.gallery a');
const fetchService = new FetchService();

// Listeners:
input.addEventListener('input', debounce(onInput, 300));
form.addEventListener('submit', onSubmit);
loadButton.addEventListener('click', onLoadMore);
hideFormOnScroll();

// Main functions:

function onInput(e) {
  searchButton.disabled = e.target.value !== '' ? false : true;
}

function onSubmit(event) {
  event.preventDefault();
  showLoader();

  const {
    elements: { searchQuery },
  } = event.currentTarget;
  fetchService.query = searchQuery.value.trim();

  if (!loadButton.classList.contains('is-hidden')) {
    hideLoadButton();
  }

  fetchService.resetPage();
  fetchService.fetchPictures().then(handleSuccess).catch(handleError);

  hideLoader();
}

function handleSuccess({ hits, totalHits }) {
  if (totalHits === 0) {
    notifyFailure();
  } else {
    fetchService.totalHits = totalHits;
    clearGallery();
    renderGallery(hits);
    notifySuccess(totalHits);

    if (totalHits < fetchService.perPage && totalHits > 12) {
      processEndOfPage();
    }

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
  showLoader();

  if (fetchService.lastPage === fetchService.page) {
    hideLoadButton();
    processEndOfPage();
  }

  fetchService
    .fetchPictures()
    .then(({ hits }) => {
      return (newGallery = renderGallery(hits));
    })
    .catch(handleError);

  hideLoader();
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

function notifyOnPageEnd() {
  Notify.warning(`We're sorry, but you've reached the end of search results`);
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

function hideFormOnScroll() {
  let prevScrollPos = window.pageYOffset;
  window.onscroll = function () {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > prevScrollPos) {
      form.classList.add('hidden');
    } else {
      form.classList.remove('hidden');
    }
    prevScrollPos = currentScrollPos;
  };
}

function scrollSmooth() {
  let distance = 0;

  if (fetchService.page === 2) {
    distance = galleryEl.firstElementChild.getBoundingClientRect().top;
  } else if (fetchService.page > 1) {
    distance =
      galleryEl.lastElementChild.getBoundingClientRect().height * 2 - 80;
  }

  window.scrollBy({
    top: distance,
    behavior: 'smooth',
  });
}

function processEndOfPage() {
  const debounceFn = debounce(onScroll, 300);
  window.addEventListener('scroll', debounceFn);
  const initialCoord = window.scrollY;
  const lastFetchHeight =
    ((fetchService.totalHits % fetchService.perPage) / 4) * 250;

  function onScroll() {
    if (window.scrollY > initialCoord + lastFetchHeight) {
      window.removeEventListener('scroll', debounceFn);
      notifyOnPageEnd();
    }
  }
}

// Spinner

function showLoader() {
  loader.classList.remove('is-hidden');
}

function hideLoader() {
  loader.classList.add('is-hidden');
}
