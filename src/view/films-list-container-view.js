import {createElement} from '../render.js';

export default class FilmsListContainerView {
  getTemplate() {
    return `<div class="films-list__container">

            </div>`;
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
