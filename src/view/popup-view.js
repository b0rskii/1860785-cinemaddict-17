import AbstractView from '../framework/view/abstract-view.js';
import {formatRuntime, formatDate} from '../utils/film.js';

const Format = {
  RELEASE_DATE: 'DD MMMM YYYY',
  COMMENT_DATE: 'YYYY/MM/DD HH:MM'
};

const createGenreTemplate = (genres) => {
  const elements = [];

  genres.forEach((item) => elements.push(`<span class="film-details__genre">${item}</span>`));

  return elements.join('');
};

export default class PopupView extends AbstractView {
  #poster = null;
  #ageRating = null;
  #title = null;
  #alternativeTitle = null;
  #totalRating = null;
  #director = null;
  #writers = null;
  #actors = null;
  #releaseDate = null;
  #runtime = null;
  #releaseCountry = null;
  #genre = null;
  #genresTerm = null;
  #description = null;

  #body = document.querySelector('body');
  #closeButton = null;

  constructor (film) {
    super();
    this.#poster = film.filmInfo.poster;
    this.#ageRating = film.filmInfo.ageRating;
    this.#title = film.filmInfo.title;
    this.#alternativeTitle = film.filmInfo.alternativeTitle;
    this.#totalRating = film.filmInfo.totalRating.toFixed(1);
    this.#director = film.filmInfo.director;
    this.#writers = film.filmInfo.writers;
    this.#actors = film.filmInfo.actors;
    this.#releaseDate = film.filmInfo.release.date;
    this.#runtime = film.filmInfo.runtime;
    this.#releaseCountry = film.filmInfo.release.releaseCountry;
    this.#genre = film.filmInfo.genre;
    this.#genresTerm = this.#genre.length > 1 ? 'Genres' : 'Genre';
    this.#description = film.filmInfo.description;

    this.#closeButton = this.element.querySelector('.film-details__close-btn');
  }

  get template() {
    return `<section class="film-details">
              <form class="film-details__inner" action="" method="get">
                <div class="film-details__top-container">
                  <div class="film-details__close">
                    <button class="film-details__close-btn" type="button">close</button>
                  </div>
                  <div class="film-details__info-wrap">
                    <div class="film-details__poster">
                      <img class="film-details__poster-img" src=${this.#poster} alt="">

                      <p class="film-details__age">${this.#ageRating}+</p>
                    </div>

                    <div class="film-details__info">
                      <div class="film-details__info-head">
                        <div class="film-details__title-wrap">
                          <h3 class="film-details__title">${this.#title}</h3>
                          <p class="film-details__title-original">Original: ${this.#alternativeTitle}</p>
                        </div>

                        <div class="film-details__rating">
                          <p class="film-details__total-rating">${this.#totalRating}</p>
                        </div>
                      </div>

                      <table class="film-details__table">
                        <tr class="film-details__row">
                          <td class="film-details__term">Director</td>
                          <td class="film-details__cell">${this.#director}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Writers</td>
                          <td class="film-details__cell">${this.#writers.join(', ')}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Actors</td>
                          <td class="film-details__cell">${this.#actors.join(', ')}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Release Date</td>
                          <td class="film-details__cell">${formatDate(this.#releaseDate, Format.RELEASE_DATE)}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Runtime</td>
                          <td class="film-details__cell">${formatRuntime(this.#runtime)}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Country</td>
                          <td class="film-details__cell">${this.#releaseCountry}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">${this.#genresTerm}</td>
                          <td class="film-details__cell">
                            ${createGenreTemplate(this.#genre)}
                          </td>
                        </tr>
                      </table>

                      <p class="film-details__film-description">
                        ${this.#description}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="film-details__bottom-container">
                  <section class="film-details__comments-wrap">

                  </section>
                </div>
              </form>
            </section>`;
  }

  get container() {
    return document.querySelector('body');
  }

  get controlsContainer() {
    return this.element.querySelector('.film-details__top-container');
  }

  get commentsContainer() {
    return this.element.querySelector('.film-details__comments-wrap');
  }

  checkCommentsRenderStatus = () => document.querySelector('.film-details__comments-list');

  bodyAddHideOverflow = () => {
    this.#body.classList.add('hide-overflow');
  };

  bodyRemoveHideOverflow = () => {
    this.#body.classList.remove('hide-overflow');
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.#closeButton.addEventListener('click', this.#closeButtonClickHandler);
  };

  setEscapeKeydownHandler = (callback) => {
    this._callback.setEscapeKeydown = callback;
    document.addEventListener('keydown', this.#escapeKeydownHandler);
  };

  removeEscapeKeydownHandler = () => {
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
  };

  #closeButtonClickHandler = () => {
    this._callback.closeButtonClick();
  };

  #escapeKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._callback.setEscapeKeydown();
    }
  };
}
