import { throttle } from 'lodash';
import { notifyError } from './notifications';

const scrollThrottle = throttle(checkPosition, 300);
const resizeThrottle = throttle(checkPosition, 300);

export function addInfiniteScrollListeners() {
  window.addEventListener('scroll', scrollThrottle);
  window.addEventListener('resize', resizeThrottle);
  console.log(`listened added`);
}

export function removeInfiniteScrollListeners() {
  window.removeEventListener('scroll', scrollThrottle);
  window.removeEventListener('resize', resizeThrottle);
  console.log(`listener removed`);
}

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
      console.log('Reached the load point: ', position);
      const nextLoad = await onLoadMore();
    }
  } catch (error) {
    console.log(error);
    notifyError();
  }
}
