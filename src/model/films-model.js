import Observable from '../framework/observable.js';
import {Amount, generateFilm, generateComment} from '../fish/film.js';

export default class FilmsModel extends Observable {
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

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  };
}
