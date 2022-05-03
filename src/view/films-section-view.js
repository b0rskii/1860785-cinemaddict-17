import {createElement} from '../render.js';

export default class FilmsSectionView {
  #element = null;

  get template() {
    return `<section class="films">

            </section>`;
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
