import {generateFilm, generateComment} from '../fish/film.js';
import {Count} from '../fish/film.js';

export default class FilmsModel {
  films = Array.from({length: Count.FILMS}, generateFilm);
  comments = Array.from({length: Count.COMMENTS}, generateComment);

  getFilms = () => this.films;
  getComments = () => this.comments;
}
