import AbstractView from '../framework/view/abstract-view.js';
import {formatDateFromNow} from '../utils/film.js';

const createCommentsTemplate = (comments) => {
  const elements = [];

  comments.forEach((item) => elements.push(
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${item.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${formatDateFromNow(item.date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  ));

  return elements.join('');
};

export default class PopupCommentsView extends AbstractView {
  #filmComments = [];
  #commentCount = null;

  constructor (film, comments) {
    super();
    this.#filmComments = this.#getFilmComments(film, comments);
    this.#commentCount = this.#filmComments.length;
  }

  get template() {
    return  `<div>
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this.#commentCount}</span></h3>
              <ul class="film-details__comments-list">
                ${createCommentsTemplate(this.#filmComments)}
              </ul>
            </div>`;
  }

  #getFilmComments = (film, comments) => {
    const filmComments = [];

    film.comments.forEach((commentId) => {
      const filmComment = comments.find((item) => item.id === commentId);
      filmComments.push(filmComment);
    });

    return filmComments;
  };

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.addEventListener('click', this.#deleteButtonClickHandler);
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.matches('button.film-details__comment-delete')) {
      this._callback.deleteClick(evt.target.closest('li').dataset.id);
    }
  };
}
