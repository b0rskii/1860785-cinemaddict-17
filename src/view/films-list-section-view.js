import {createElement} from '../render.js';

export default class FilmsListSectionView {
  getTemplate() {
    return `<section class="films-list">
              <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
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
