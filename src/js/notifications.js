import { Notify } from 'notiflix';

export function notifySuccess(amount) {
  const images = amount !== 1 ? 'images' : 'image';
  Notify.success(`Hooray! We found ${amount} ${images}`);
}

export function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

export function notifyError() {
  Notify.failure('Oops, something went wrong. Try again');
}

export function notifyOnPageEnd() {
  Notify.warning(`We're sorry, but you've reached the end of search results`);
}
