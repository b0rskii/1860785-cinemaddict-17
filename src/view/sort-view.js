import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

export default class SortView extends AbstractView {
  get template() {
    return `<ul class="sort">
              <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
              <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
              <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RAITING}">Sort by rating</a></li>
            </ul>`;
  }

  changeActiveElement = (sortType) => {
    const sortButtons = this.element.querySelectorAll('.sort__button');

    for (const sortButton of sortButtons) {
      if (sortButton.classList.contains('sort__button--active')) {
        sortButton.classList.remove('sort__button--active');
        break;
      }
    }

    this.element.querySelector(`[data-sort-type="${sortType}"]`).classList.add('sort__button--active');
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    if (evt.target.matches('a')) {
      evt.preventDefault();
      this._callback.click(evt.target.dataset.sortType);
    }
  };
}
