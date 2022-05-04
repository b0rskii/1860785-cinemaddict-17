import {createElement} from '../render.js';

export default class NoFilmsView {
  #element = null;

  get template() {
    return `<section class="films-list">
              <h2 class="films-list__title">There are no movies in our database</h2>
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
