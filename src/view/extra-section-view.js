import AbstractView from '../framework/view/abstract-view.js';

export default class ExtraSectionView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return `<section class="films-list films-list--extra">
              <h2 class="films-list__title">${this.#title}</h2>
            </section>`;
  }
}
