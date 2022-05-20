import AbstractView from '../framework/view/abstract-view.js';
import {FilterType, ActiveClass} from '../const.js';
import {addClassByCondition} from '../utils/common.js';

export default class NavigationView extends AbstractView {
  #watchlistFilms = [];
  #watchedFilms = [];
  #favoriteFilms = [];
  #activeFilter = null;

  constructor (watchlistFilms, watchedFilms, favoriteFilms, activeFilter) {
    super();
    this.#watchlistFilms = watchlistFilms;
    this.#watchedFilms = watchedFilms;
    this.#favoriteFilms = favoriteFilms;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return `<nav class="main-navigation">
              <a href="#all" class="main-navigation__item ${addClassByCondition(this.#activeFilter === FilterType.ALL, ActiveClass.NAVIGATION_ITEM)}" data-filter-type="${FilterType.ALL}">All movies</a>
              <a href="#watchlist" class="main-navigation__item ${addClassByCondition(this.#activeFilter === FilterType.WATCHLIST, ActiveClass.NAVIGATION_ITEM)}" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${this.#watchlistFilms.length}</span></a>
              <a href="#history" class="main-navigation__item ${addClassByCondition(this.#activeFilter === FilterType.WATCHED, ActiveClass.NAVIGATION_ITEM)}" data-filter-type="${FilterType.WATCHED}">History <span class="main-navigation__item-count">${this.#watchedFilms.length}</span></a>
              <a href="#favorites" class="main-navigation__item ${addClassByCondition(this.#activeFilter === FilterType.FAVORITES, ActiveClass.NAVIGATION_ITEM)}" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${this.#favoriteFilms.length}</span></a>
            </nav>`;
  }

  changeActiveElement = (filterType) => {
    const filters = this.element.querySelectorAll('.main-navigation__item');

    for (const filter of filters) {
      if (filter.classList.contains(ActiveClass.NAVIGATION_ITEM)) {
        filter.classList.remove(ActiveClass.NAVIGATION_ITEM);
        break;
      }
    }

    this.element.querySelector(`[data-filter-type="${filterType}"]`).classList.add(ActiveClass.NAVIGATION_ITEM);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    if (evt.target.matches('a') || evt.target.matches('span')) {
      evt.preventDefault();
      this._callback.click(evt.target.dataset.filterType || evt.target.parentElement.dataset.filterType);
    }
  };
}
