import { showEl, hideEl } from './toggleEl';

export function hideButton(el) {
  if (!el.classList.contains('is-hidden')) {
    hideEl(el);
  }
}

export function showButton(el, fetch) {
  if (fetch.query === '') {
    return;
  }

  if (el.classList.contains('is-hidden')) {
    showEl(el);
  }
}
