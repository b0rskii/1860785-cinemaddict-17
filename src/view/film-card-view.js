import {createElement} from '../render.js';
import {formatDescription, formatRuntime, formatDate} from '../util.js';

const DESCRIPTION_MAX_LENGTH = 140;
const RELEASE_DATE_FORMAT = 'YYYY';

export default class FilmCardView {
  constructor (film) {
    this.filmId = film.id;
    this.title = film.filmInfo.title;
    this.totalRating = film.filmInfo.totalRating;
    this.poster = film.filmInfo.poster;
    this.description = film.filmInfo.description;
    this.runtime = film.filmInfo.runtime;
    this.releaseDate = film.filmInfo.release.date;
    this.comments = film.commentsId;
    this.genre = film.filmInfo.genre;
  }

  getTemplate() {
    return `<article class="film-card" data-id="${this.filmId}">
              <a class="film-card__link">
                <h3 class="film-card__title" data-id="${this.filmId}">${this.title}</h3>
                <p class="film-card__rating" data-id="${this.filmId}">${this.totalRating}</p>
                <p class="film-card__info" data-id="${this.filmId}">
                  <span class="film-card__year" data-id="${this.filmId}">${formatDate(this.releaseDate, RELEASE_DATE_FORMAT)}</span>
                  <span class="film-card__duration" data-id="${this.filmId}">${formatRuntime(this.runtime)}</span>
                  <span class="film-card__genre" data-id="${this.filmId}">${this.genre[0]}</span>
                </p>
                <img src=${this.poster} alt="" class="film-card__poster" data-id="${this.filmId}">
                <p class="film-card__description" data-id="${this.filmId}">${formatDescription(this.description, DESCRIPTION_MAX_LENGTH)}</p>
                <span class="film-card__comments" data-id="${this.filmId}">${this.comments.length} comments</span>
              </a>
              <div class="film-card__controls" data-id="${this.filmId}">
                <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
                <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
                <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
              </div>
            </article>`;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
