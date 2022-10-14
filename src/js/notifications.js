import { Notify } from 'notiflix';

export function onSuccess(amount) {
  const images = amount !== 1 ? 'images' : 'image';
  Notify.success(`Hooray! We found ${amount} ${images}`);
}

export function onFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
