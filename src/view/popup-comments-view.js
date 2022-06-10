import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formatDateFromNow} from '../utils/film.js';

const DeleteButtonText = {
  DELETE: 'Delete',
  DELETING: 'Deleting...'
};

const createCommentsTemplate = (state) => {
  const elements = [];

  state.comments.forEach((item) => elements.push(
    `<li class="film-details__comment" data-id="${item.id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${item.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${formatDateFromNow(item.date)}</span>
          <button ${state.deletingCommentId === item.id ? 'disabled' : ''} class="film-details__comment-delete">${state.deletingCommentId === item.id ? DeleteButtonText.DELETING : DeleteButtonText.DELETE}</button>
        </p>
      </div>
    </li>`
  ));

  return elements.join('');
};

export default class PopupCommentsView extends AbstractStatefulView {
  #commentCount = null;

  constructor (filmComments) {
    super();
    this._state = this.#convertDataToState(filmComments);
    this.#commentCount = this._state.comments.length;
  }

  get template() {
    return  `<div>
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this.#commentCount}</span></h3>
              <ul class="film-details__comments-list">
                ${createCommentsTemplate(this._state)}
              </ul>
            </div>`;
  }

  #convertDataToState = (data) => ({
    comments: [...data],
    deletingCommentId: ''
  });

  _restoreHandlers = () => {
    this.setDeleteButtonClickHandler(this._callback.deleteClick);
  };

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.addEventListener('click', this.#deleteButtonClickHandler);
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.matches('button.film-details__comment-delete')) {
      const commentId = evt.target.closest('li').dataset.id;

      this._callback.deleteClick(commentId);
    }
  };
}
