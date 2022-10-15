const API_URL = 'https://pixabay.com/api/';
const API_KEY = '30604189-8e45b74ccc7e3af0dfc4ff4c6';

let pageNum = 1;

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  page: pageNum,
  per_page: '40',
});

function makeUrl(query) {
  return `${API_URL}?key=${API_KEY}&q=${query}&${searchParams}`;
}

export function fetchPictures(query) {
  const url = makeUrl(query);
  return fetch(url).then(r => {
    if (!r.ok) {
      throw new Error(r.status);
    }
    return r.json();
  });
}
