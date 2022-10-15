export function renderMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
    <b>Likes</b>
      <svg class="gallery-icon" width="16px" height="16px">
      <use class="icon" href="/icons.adfc4680.svg#icon-heart"></use>
    </svg>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      <svg class="gallery-icon" width="16px" height="16px">
      <use class="icon" href="/icons.adfc4680.svg#icon-eye"></use>
    </svg>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      <svg class="gallery-icon" width="16px" height="16px">
      <use class="icon" href="./icons.adfc4680.svg#icon-bubbles"></use>
    </svg>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <svg class="gallery-icon" width="16px" height="16px">
      <use class="icon" href="./icons.adfc4680.svg#icon-download"></use>
    </svg>
      ${downloads}
    </p>
  </div>
  </div>
  </a>`;
      }
    )
    .join('');

  return markup;
}
