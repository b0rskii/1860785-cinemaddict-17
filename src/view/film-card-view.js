import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formatDescription, formatRuntime, formatDate} from '../utils/film.js';
import {addClassByCondition} from '../utils/common.js';
import {ActiveClass} from '../const.js';

const DESCRIPTION_MAX_LENGTH = 140;
const RELEASE_DATE_FORMAT = 'YYYY';

export default class FilmCardView extends AbstractStatefulView{
  #title = null;
  #totalRating = null;
  #poster = null;
  #description = null;
  #runtime = null;
  #releaseDate = null;
  #comments = null;
  #genre = null;
  #isWatchlistFilm = null;
  #isWatchedFilm = null;
  #isFavoriteFilm = null;

  #watchlistButton = null;
  #watchedButton = null;
  #favoriteButton = null;

  constructor (film) {
    super();
    this._state = this.#convertDataToState(film);
    this.#title = this._state.filmInfo.title;
    this.#totalRating = this._state.filmInfo.totalRating.toFixed(1);
    this.#poster = this._state.filmInfo.poster;
    this.#description = this._state.filmInfo.description;
    this.#runtime = this._state.filmInfo.runtime;
    this.#releaseDate = this._state.filmInfo.release.date;
    this.#comments = this._state.comments;
    this.#genre = this._state.filmInfo.genre;
    this.#isWatchlistFilm = this._state.userDetails.watchlist;
    this.#isWatchedFilm = this._state.userDetails.alreadyWatched;
    this.#isFavoriteFilm = this._state.userDetails.favorite;

    this.#watchlistButton = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    this.#watchedButton = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    this.#favoriteButton = this.element.querySelector('.film-card__controls-item--favorite');
  }

  get template() {
    return `<article class="film-card">
              <a class="film-card__link">
                <h3 class="film-card__title">${this.#title}</h3>
                <p class="film-card__rating">${this.#totalRating}</p>
                <p class="film-card__info">
                  <span class="film-card__year">${formatDate(this.#releaseDate, RELEASE_DATE_FORMAT)}</span>
                  <span class="film-card__duration">${formatRuntime(this.#runtime)}</span>
                  <span class="film-card__genre">${this.#genre[0]}</span>
                </p>
                <img src=${this.#poster} alt="" class="film-card__poster">
                <p class="film-card__description">${formatDescription(this.#description, DESCRIPTION_MAX_LENGTH)}</p>
                <span class="film-card__comments">${this.#comments.length} comments</span>
              </a>
              <div class="film-card__controls">
                <button ${this._state.isDisabled ? 'disabled' : ''} class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addClassByCondition(this.#isWatchlistFilm, ActiveClass.FILM_CARD_CONTROL)}" type="button">Add to watchlist</button>
                <button ${this._state.isDisabled ? 'disabled' : ''} class="film-card__controls-item film-card__controls-item--mark-as-watched ${addClassByCondition(this.#isWatchedFilm, ActiveClass.FILM_CARD_CONTROL)}" type="button">Mark as watched</button>
                <button ${this._state.isDisabled ? 'disabled' : ''} class="film-card__controls-item film-card__controls-item--favorite ${addClassByCondition(this.#isFavoriteFilm, ActiveClass.FILM_CARD_CONTROL)}" type="button">Mark as favorite</button>
              </div>
            </article>`;
  }

  #convertDataToState = (data) => ({...data,
    isDisabled: false
  });

  _restoreHandlers = () => {
    this.setClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.#watchlistButton.addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.#watchedButton.addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.#favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    if (evt.target.closest('.film-card') && !evt.target.classList.contains('film-card__controls-item')) {
      this._callback.click();
    }
  };

  #watchlistClickHandler = () => {
    this._callback.watchlistClick();
  };

  #watchedClickHandler = () => {
    this._callback.watchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
