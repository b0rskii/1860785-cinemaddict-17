import AbstractView from '../framework/view/abstract-view.js';
import {FilterTitle} from '../const.js';

export default class NavigationView extends AbstractView {
  #watchlistFilms = [];
  #watchedFilms = [];
  #favoriteFilms = [];

  constructor (watchlistFilms, watchedFilms, favoriteFilms) {
    super();
    this.#watchlistFilms = watchlistFilms;
    this.#watchedFilms = watchedFilms;
    this.#favoriteFilms = favoriteFilms;
  }

  get template() {
    return `<nav class="main-navigation">
              <a href="#all" class="main-navigation__item main-navigation__item--active">${FilterTitle.All}</a>
              <a href="#watchlist" class="main-navigation__item">${FilterTitle.WATCHLIST} <span class="main-navigation__item-count">${this.#watchlistFilms.length}</span></a>
              <a href="#history" class="main-navigation__item">${FilterTitle.WATCHED} <span class="main-navigation__item-count">${this.#watchedFilms.length}</span></a>
              <a href="#favorites" class="main-navigation__item">${FilterTitle.FAVORITES} <span class="main-navigation__item-count">${this.#favoriteFilms.length}</span></a>
            </nav>`;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', this.#clickHandler);
    });
  };

  #clickHandler = (evt) => {
    this._callback.click(evt);
  };
}
