import AbstractView from '../framework/view/abstract-view.js';

export default class NumberOfFilmsView extends AbstractView {
  get template() {
    return `<p>
              130 291 movies inside
            </p>`;
  }
}
