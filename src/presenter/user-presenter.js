import UserView from '../view/user-view.js';
import {render, remove, replace} from '../framework/render.js';

export default class UserPresenter {
  #container = null;
  #filmsModel = null;

  #userComponent = null;

  constructor (container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get watchedFilms() {
    return this.#filmsModel.films.filter((item) => item.userDetails.alreadyWatched);
  }

  init = () => {
    const prevUserComponetn = this.#userComponent;

    this.#userComponent = new UserView(this.watchedFilms);

    if (prevUserComponetn === null) {
      render(this.#userComponent, this.#container);
      return;
    }

    replace(this.#userComponent, prevUserComponetn);
    remove(prevUserComponetn);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
