import NumberOfFilmsView from '../view/number-of-films-view.js';
import {UpdateType} from '../const.js';
import {render, remove, replace} from '../framework/render.js';

export default class FooterPresenter {
  #container = null;
  #filmsModel = null;

  #footerComponent = null;

  constructor (container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    return this.#filmsModel.films;
  }

  init = () => {
    const prevFooterComponent = this.#footerComponent;

    this.#footerComponent = new NumberOfFilmsView(this.films);

    if (prevFooterComponent === null) {
      render(this.#footerComponent, this.#container);
      return;
    }

    replace(this.#footerComponent, prevFooterComponent);
    remove(prevFooterComponent);
  };

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
