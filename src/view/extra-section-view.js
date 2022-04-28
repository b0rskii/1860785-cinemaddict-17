import {createElement} from '../render.js';

export default class ExtraSectionView {
  constructor(title) {
    this.title = title;
  }

  getTemplate() {
    return `<section class="films-list films-list--extra">
              <h2 class="films-list__title">${this.title}</h2>
            </section>`;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
