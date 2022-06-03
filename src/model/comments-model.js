import Observable from '../framework/observable.js';
import {Amount, generateComment} from '../fish/film.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({length: Amount.COMMENTS}, generateComment);

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.find((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  };
}
