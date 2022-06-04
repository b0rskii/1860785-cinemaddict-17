import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor (commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  getFilmComments = async (filmId) => {
    try {
      this.#comments = await this.#commentsApiService.getFilmComments(filmId);
      return [...this.#comments];
    } catch {
      return [];
    }
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
      throw new Error('Can\'t delete unexisting film');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  };
}
