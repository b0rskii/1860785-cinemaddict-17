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

  addComment = async (updateType, update) => {
    try {
      const response = await this.#commentsApiService.addComment(update);
      const updatedComments = response.comments;

      this.#comments = updatedComments;
      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((item) => item.id === update.comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    try {
      await this.#commentsApiService.deleteComment(update.comment);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1)
      ];
      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t delete comment');
    }
  };
}
