import {createElement} from '../render.js';

export default class ShowMoreButtonView {
  #element = null;

  get template() {
    return `<button class="films-list__show-more">
              Show more
            </button>`;
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
