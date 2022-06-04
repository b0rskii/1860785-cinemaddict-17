import AbstractView from '../framework/view/abstract-view.js';
import {formatDescription, formatRuntime, formatDate} from '../utils/film.js';
import {addClassByCondition} from '../utils/common.js';
import {ActiveClass} from '../const.js';

const DESCRIPTION_MAX_LENGTH = 140;
const RELEASE_DATE_FORMAT = 'YYYY';

export default class FilmCardView extends AbstractView{
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

  constructor (film) {
    super();
    this.#title = film.filmInfo.title;
    this.#totalRating = film.filmInfo.totalRating;
    this.#poster = film.filmInfo.poster;
    this.#description = film.filmInfo.description;
    this.#runtime = film.filmInfo.runtime;
    this.#releaseDate = film.filmInfo.release.date;
    this.#comments = film.comments;
    this.#genre = film.filmInfo.genre;
    this.#isWatchlistFilm = film.userDetails.watchlist;
    this.#isWatchedFilm = film.userDetails.alreadyWatched;
    this.#isFavoriteFilm = film.userDetails.favorite;
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
                <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addClassByCondition(this.#isWatchlistFilm, ActiveClass.FILM_CARD_CONTROL)}" type="button">Add to watchlist</button>
                <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${addClassByCondition(this.#isWatchedFilm, ActiveClass.FILM_CARD_CONTROL)}" type="button">Mark as watched</button>
                <button class="film-card__controls-item film-card__controls-item--favorite ${addClassByCondition(this.#isFavoriteFilm, ActiveClass.FILM_CARD_CONTROL)}" type="button">Mark as favorite</button>
              </div>
            </article>`;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
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
