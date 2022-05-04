import {createElement} from '../render.js';

export default class FilmsListContainerView {
  #element = null;

  get template() {
    return `<div class="films-list__container">

            </div>`;
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
