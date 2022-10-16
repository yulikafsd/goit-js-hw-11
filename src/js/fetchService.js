import axios from 'axios';

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '30604189-8e45b74ccc7e3af0dfc4ff4c6';
const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
});

export class FetchService {
  constructor() {
    this.searchQuery = '';
    this.totalHits = '';
    this.page = 1;
    this.perPage = 40;
  }

  fetchPictures() {
    const url = `${API_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}&per_page=${this.perPage}`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      this.incrementPage();
      return response.json();
    });
  }

  get lastPage() {
    return Math.ceil(this.totalHits / this.perPage);
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
