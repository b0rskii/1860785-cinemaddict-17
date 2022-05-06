import AbstractView from '../framework/view/abstract-view.js';

export default class NoFilmsView extends AbstractView {
  get template() {
    return `<section class="films-list">
              <h2 class="films-list__title">There are no movies in our database</h2>
            </section>`;
  }
}
