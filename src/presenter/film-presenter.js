import FilmCardView from '../view/film-card-view';
import PopupPresenter from '../presenter/popup-presenter.js';
import {render, remove, replace} from '../framework/render.js';
import {FilterType} from '../const.js';

const Film = {
  RENDERED: 'RENDERED',
  NOT_RENDERED: 'NOT_RENDERED'
};

export default class FilmPresenter {
  #container = null;

  #film = null;
  #filmComments = null;
  #filmComponent = null;

  #filmStatus = Film.NOT_RENDERED;
  #changeData = null;
  #changeFilter = null;

  #popup = null;

  constructor (container, changeData, changeFilter, popup) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeFilter = changeFilter;
    this.#popup = popup;
  }

  init = (film, filmComments) => {
    this.#film = film;
    this.#filmComments = filmComments;

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

  #onFilmCardClick = () => {
    if (this.#popup.size > 0) {
      this.#popup.forEach((item) => item.destroy());
      this.#popup.clear();
    }

    const popupPresenter = new PopupPresenter(this.#changeData, this.#changeFilter);
    popupPresenter.init(this.#film, this.#filmComments);

    this.#popup.set(this.#film.id, popupPresenter);
  };

  #onWatchlistControlClick = () => {
    this.#film.userDetails.watchlist = !(this.#film.userDetails.watchlist);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, FilterType.WATCHLIST);
  };

  #onWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, FilterType.WATCHED);
  };

  #onFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, FilterType.FAVORITES);
  };
}
