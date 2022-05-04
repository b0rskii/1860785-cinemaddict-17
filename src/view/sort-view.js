import {createElement} from '../render.js';

export default class SortView {
  #element = null;

  get template() {
    return `<ul class="sort">
              <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
              <li><a href="#" class="sort__button">Sort by date</a></li>
              <li><a href="#" class="sort__button">Sort by rating</a></li>
            </ul>`;
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
