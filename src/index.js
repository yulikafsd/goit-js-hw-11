import axios from 'axios';
import { form, input } from './js/refs';
import { fetchPictures } from './js/fetchPictures';
import { onSuccess, onFailure } from './js/notifications';

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const query = e.currentTarget.elements.searchQuery.value;
  fetchPictures(query).then(r => {
    if (r.totalHits <= 0) {
      console.log(r.hits);
      onFailure();
    } else {
      onSuccess(r.totalHits);
      console.log(r.hits); // перебрать массив с объектами и нарисовать разметку по шаблону
    }
  });
}
