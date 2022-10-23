// Libraries:
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { debounce, throttle } from 'lodash';

// Modules:
import { FetchService } from './js/fetchService';
import markupTpl from './templates/markup.hbs';
import { getRefs } from './js/getRefs';
import {
  notifySuccess,
  notifyFailure,
  notifyError,
  notifyOnPageEnd,
} from './js/notifications';
import { hideButton, showButton } from './js/toggleButton';
import { showEl, hideEl } from './js/toggleEl';
import { scrollSmooth } from './js/scrollSmoothFn';

//Constants:
const { form, spanEl, searchButton, checkbox, galleryEl, loadButton, loader } =
  getRefs();
const input = form.elements.searchQuery;
const scrollThrottle = throttle(checkPosition, 300);
const resizeThrottle = throttle(checkPosition, 300);
let prevScrollPos = window.pageYOffset;

//Classes:
const fetchService = new FetchService();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  fadeSpeed: 500,
});

// Listeners:
input.addEventListener('input', debounce(onInput, 200));
form.addEventListener('submit', onSubmit);
loadButton.addEventListener('click', onLoadMore);
window.addEventListener('scroll', throttle(onScrollToggleForm, 200));
checkbox.addEventListener('change', onChange);

// Main functions:

async function onSubmit(event) {
  try {
    event.preventDefault();
    showEl(loader);

    const {
      elements: { searchQuery },
    } = event.currentTarget;

    fetchService.query = searchQuery.value.trim();
    fetchService.resetPage();
    hideButton(loadButton);

    const promise = await fetchService.fetchPictures();

    // If no pictures found - notify failure
    if (promise.totalHits < 1) {
      notifyFailure();
    } else {
      handleSuccess(promise);
      checkButtonStat();
    }

    hideEl(loader);
  } catch (error) {
    handleError(error);
  }
}

async function onLoadMore() {
  try {
    showEl(loader);
    loadButton.disabled = true;

    const promise = await fetchService.fetchPictures();
    const gallery = await renderGallery(promise.hits);
    checkButtonStat();
    hideEl(loader);
    loadButton.disabled = false;
  } catch (error) {
    handleError(error);
  }
}

function onInput(event) {
  // Disable button if input is empty
  searchButton.disabled = event.target.value !== '' ? false : true;
}

function onScrollToggleForm() {
  const currentScrollPos = window.scrollY;

  if (currentScrollPos > prevScrollPos) {
    form.classList.add('hidden');
  } else {
    form.classList.remove('hidden');
  }
  prevScrollPos = currentScrollPos;
}

function onChange() {
  console.log(`change`);
  if (checkbox.checked) {
    console.log(`off`);
    spanEl.textContent = 'Off';
  }

  if (!checkbox.checked) {
    console.log(`on`);
    spanEl.textContent = 'On';
  }
}

async function handleSuccess({ hits, totalHits }) {
  try {
    fetchService.totalHits = totalHits;
    const clear = await clearGallery();
    const gallery = await renderGallery(hits);
    notifySuccess(totalHits);
    checkButtonStat();
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  console.log(error);
  notifyError();
}

function processPageEnd() {
  const currentPage = fetchService.page;
  const cardHeight = 250;
  const topScrollPos = window.scrollY;
  const lastPageRowsNum = (fetchService.totalHits % fetchService.perPage) / 4;
  const lastPageScrollHeight = lastPageRowsNum * cardHeight;

  const debounceScroll = debounce(notifyPageEnd, 300);
  window.addEventListener('scroll', debounceScroll);

  function notifyPageEnd() {
    // when there is only 1 page or if scroll did not reach the page bottom and the new request is searched
    if (fetchService.page === 2 || currentPage > fetchService.page) {
      window.removeEventListener('scroll', debounceScroll);

      // when scroll reaches the bottom of the last page
    } else if (window.scrollY > topScrollPos + lastPageScrollHeight) {
      window.removeEventListener('scroll', debounceScroll);
      notifyOnPageEnd();
    }
  }
}

function checkButtonStat() {
  const currentFetchPage = fetchService.page - 1;
  // If current fetched page is the last page =>
  // don't show loadMore button and add scroll listener to notify when page ends
  if (fetchService.lastPage === currentFetchPage) {
    processPageEnd();
    hideButton(loadButton);
    removeInfiniteScrollListeners();
  }

  // If more than 1 page is found & checkbox is off => show loadMore button and turn infscroll off
  else if (!checkbox.checked) {
    showButton(loadButton, fetchService);
    removeInfiniteScrollListeners();

    // If more than 1 page is found & checkbox is on => hide btn and turn infscroll on
  } else if (checkbox.checked) {
    hideButton(loadButton);
    addInfiniteScrollListeners();
  }
}

// Inf.scroll listeners functions

async function checkPosition() {
  try {
    // Doc height
    const height = document.body.offsetHeight;
    // Screen height
    const screenHeight = window.innerHeight;
    // How far a user scrolled
    const scrolled = window.scrollY;
    // Threshold when new pics schould be uploaded
    const threshold = height - screenHeight / 3;
    // Check position
    const position = scrolled + screenHeight;

    if (position > threshold) {
      const nextLoad = await onLoadMore();
      return nextLoad;
    }
  } catch (error) {
    handleError(error);
  }
}

function addInfiniteScrollListeners() {
  window.addEventListener('scroll', scrollThrottle);
  window.addEventListener('resize', resizeThrottle);
}

function removeInfiniteScrollListeners() {
  window.removeEventListener('scroll', scrollThrottle);
  window.removeEventListener('resize', resizeThrottle);
}

// Gallery functions

async function clearGallery() {
  try {
    galleryEl.innerHTML = '';
  } catch (error) {
    handleError(error);
  }
}

async function renderGallery(arr) {
  try {
    galleryEl.insertAdjacentHTML('beforeend', markupTpl(arr));
    lightbox.refresh();
    const scroll = await scrollSmooth(galleryEl, fetchService);
    return scroll;
  } catch (error) {
    handleError(error);
  }
}
