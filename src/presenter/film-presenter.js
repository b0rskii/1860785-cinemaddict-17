import FilmCardView from '../view/film-card-view';
import PopupPresenter from '../presenter/popup-presenter.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

const Film = {
  RENDERED: 'RENDERED',
  NOT_RENDERED: 'NOT_RENDERED'
};

export default class FilmPresenter {
  #container = null;

  #film = null;
  #getFilmComments = null;
  #filmComponent = null;

  #filmStatus = Film.NOT_RENDERED;
  #handleViewAction = null;

  constructor (container, handleViewAction, popupPresenter, popupComponent) {
    this.#container = container;
    this.#handleViewAction = handleViewAction;
    this.popupPresenter = popupPresenter;
    this.popupComponent = popupComponent;
  }

  init = (film, getFilmComments) => {
    this.#film = film;
    this.#getFilmComments = getFilmComments;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(film);

    this.#filmComponent.setClickHandler(this.#onFilmCardClick);
    this.#filmComponent.setWatchlistClickHandler(this.#onWatchlistControlClick);
    this.#filmComponent.setWatchedClickHandler(this.#onWatchedControlClick);
    this.#filmComponent.setFavoriteClickHandler(this.#onFavoriteControlClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#container);
      this.#filmStatus = Film.RENDERED;
      return;
    }

    if (this.#filmStatus === Film.RENDERED) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  setSaving = () => {
    this.#filmComponent.updateElement({
      isDisabled: true
    });
  };

  setAborting = () => {
    const resetFilmState = () => {
      this.#filmComponent.updateElement({
        isDisabled: false
      });
    };

    this.#filmComponent.shake(resetFilmState);
  };

  #onFilmCardClick = () => {
    if (this.popupPresenter.size > 0 && !this.popupPresenter.has(this.#film.id)) {
      this.popupPresenter.forEach((item) => item.destroy());
      this.popupPresenter.clear();
      this.popupComponent.forEach((item) => remove(item));
      this.popupComponent.clear();
    }

    if (!this.popupPresenter.has(this.#film.id)) {
      const newPopupPresenter = new PopupPresenter(this.#handleViewAction, this.popupPresenter, this.popupComponent);
      newPopupPresenter.init(this.#film, this.#getFilmComments);

      this.popupPresenter.set(this.#film.id, newPopupPresenter);
    }
  };

  #onWatchlistControlClick = () => {
    this.#film.userDetails.watchlist = !(this.#film.userDetails.watchlist);
    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MAJOR, this.#film);
  };

  #onWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MAJOR, this.#film);
  };

  #onFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MAJOR, this.#film);
  };
}
