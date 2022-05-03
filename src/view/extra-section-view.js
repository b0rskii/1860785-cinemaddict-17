import {createElement} from '../render.js';

export default class ExtraSectionView {
  #element = null;

  #title = null;

  constructor(title) {
    this.#title = title;
  }

  get template() {
    return `<section class="films-list films-list--extra">
              <h2 class="films-list__title">${this.#title}</h2>
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
