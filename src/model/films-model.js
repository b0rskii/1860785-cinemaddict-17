import {Amount, generateFilm, generateComment} from '../fish/film.js';

export default class FilmsModel {
  #films = Array.from({length: Amount.FILMS}, generateFilm);
  #comments = Array.from({length: Amount.COMMENTS}, generateComment);

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}
