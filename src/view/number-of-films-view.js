import AbstractView from '../framework/view/abstract-view.js';

export default class NumberOfFilmsView extends AbstractView {
  #numberOfFilms = null;

  constructor (films) {
    super();
    this.#numberOfFilms = films.length;
  }

  get template() {
    return `<p>${this.#numberOfFilms} movies inside</p>`;
  }
}
