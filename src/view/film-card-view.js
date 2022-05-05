import {createElement} from '../render.js';
import {formatDescription, formatRuntime, formatDate} from '../util.js';

const DESCRIPTION_MAX_LENGTH = 140;
const RELEASE_DATE_FORMAT = 'YYYY';

export default class FilmCardView {
  #element = null;

  #filmId = null;
  #title = null;
  #totalRating = null;
  #poster = null;
  #description = null;
  #runtime = null;
  #releaseDate = null;
  #comments = null;
  #genre = null;

  constructor (film) {
    this.#filmId = film.id;
    this.#title = film.filmInfo.title;
    this.#totalRating = film.filmInfo.totalRating;
    this.#poster = film.filmInfo.poster;
    this.#description = film.filmInfo.description;
    this.#runtime = film.filmInfo.runtime;
    this.#releaseDate = film.filmInfo.release.date;
    this.#comments = film.commentsId;
    this.#genre = film.filmInfo.genre;
  }

  get template() {
    return `<article class="film-card" data-id="${this.#filmId}">
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
                <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
                <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
                <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
              </div>
            </article>`;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
