import {Amount, generateFilm, generateComment} from '../fish/film.js';

export default class FilmsModel {
  #films = Array.from({length: Amount.FILMS}, generateFilm);
  #comments = Array.from({length: Amount.COMMENTS}, generateComment);
  #matchedComments = this.#matchCommentsWithFilms(this.#comments);

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#matchedComments;
  }

  #matchCommentsWithFilms(comments) {
    const groupedComments = [];
    const originalComments = comments.slice();

    this.#films.forEach((item) => {
      const filmComments = [];

      for (let i = 0; i < item.commentsId.length; i++) {
        filmComments.push(originalComments.shift());
      }

      groupedComments.push(filmComments);
    });

    return groupedComments;
  }
}
