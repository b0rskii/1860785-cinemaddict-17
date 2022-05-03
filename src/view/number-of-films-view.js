import {createElement} from '../render.js';

export default class NumberOfFilmsView {

  getTemplate() {
    return `<p>
              130 291 movies inside
            </p>`;
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
