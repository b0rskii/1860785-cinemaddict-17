import Observable from '../framework/observable.js';
import {Amount, generateComment} from '../fish/film.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({length: Amount.COMMENTS}, generateComment);
  #matchedComments = [];

  #films = [];

  constructor (films) {
    super();
    this.#films = films;
    this.#matchedComments = this.#matchCommentsWithFilms();
  }

  get comments() {
    return this.#matchedComments;
  }

  #matchCommentsWithFilms() {
    const matchedComments = [];

    this.#films.forEach((item) => {
      const filmComments = [];

      for (let i = 0; i < item.commentsId.length; i++) {
        const filmComment = this.#comments.find((comment) => comment.id === item.commentsId[i]);
        filmComments.push(filmComment);
      }

      matchedComments.push(filmComments);
    });

    return matchedComments;
  }

  addComment = (updateType, update) => {
    const updatedComments = [];

    this.#matchedComments.forEach((item, i) => {
      if (item.length !== this.#films[i].commentsId.length) {
        item.push(update);
        updatedComments.push(item);
      } else {
        updatedComments.push(item);
      }
    });

    this.#matchedComments = updatedComments;

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const updatedComments = [];

    for (let arr of this.#matchedComments) {
      if (arr.find((item) => item === update)) {
        const index = arr.findIndex((item) => item === update);

        arr = [...arr.slice(0, index), ...arr.slice(index + 1)];
        updatedComments.push(arr);
      } else {
        updatedComments.push(arr);
      }
    }

    this.#matchedComments = updatedComments;

    this._notify(updateType, update);
  };
}
