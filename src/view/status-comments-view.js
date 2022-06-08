import AbstractView from '../framework/view/abstract-view.js';

export default class StatusCommentsView extends AbstractView {
  #message = null;

  constructor (message) {
    super();
    this.#message = message;
  }

  get template() {
    return `<h3 class="film-details__comments-title">${this.#message}</h3>`;
  }
}
