const API_URL = 'https://pixabay.com/api/';
const API_KEY = '30604189-8e45b74ccc7e3af0dfc4ff4c6';

export class PicsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = '40';
    this.lastPage = '';
  }

  fetchPictures() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: this.per_page,
    });

    const url = `${API_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      this.incrementPage();
      return response.json();
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
