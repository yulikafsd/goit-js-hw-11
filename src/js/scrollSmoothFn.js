export async function scrollSmooth(element, fetchSample) {
  const firstFetchPageNum = 2;
  const headerFormHeight = 80;
  let scrollByDistance = 0;

  // If new search when scroll is in the middle of page
  if (
    fetchSample.page === firstFetchPageNum &&
    window.pageYOffset > headerFormHeight
  ) {
    scrollByDistance =
      element.firstElementChild.getBoundingClientRect().top - headerFormHeight;
    // On first fetch scroll form down
  } else if (fetchSample.page === firstFetchPageNum) {
    scrollByDistance = element.firstElementChild.getBoundingClientRect().top;
  } else {
    // On the next fetches scroll 2 cards height down
    scrollByDistance =
      element.lastElementChild.getBoundingClientRect().height * 2 -
      headerFormHeight;
  }

  window.scrollBy({
    top: scrollByDistance,
    behavior: 'smooth',
  });
}
