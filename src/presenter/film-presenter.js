import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view.js';
import {fixScrollbarOpen, fixScrollbarClose} from '../utils/common.js';
import {render, remove, replace} from '../framework/render.js';
import {Filter} from '../const.js';

const PopupStatus = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED'
};

export default class FilmPresenter {
  #container = null;

  #film = null;
  #filmComponent = null;
  #popupComponent = null;
  #popupContainer = null;

  #popupStatus = PopupStatus.CLOSED;
  #changeData = null;
  #changePopupStatusToClose = null;
  #changeFilter = null;

  constructor (container, changeData, changePopupStatusToClose, changeFilter) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changePopupStatusToClose = changePopupStatusToClose;
    this.#changeFilter = changeFilter;
  }

  init = (film, filmComments) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#popupComponent = new PopupView(film, filmComments);

    this.#filmComponent.setClickHandler(this.#onFilmCardClick);
    this.#filmComponent.setWatchlistClickHandler(this.#onWatchlistControlClick);
    this.#filmComponent.setWatchedClickHandler(this.#onWatchedControlClick);
    this.#filmComponent.setFavoriteClickHandler(this.#onFavoriteControlClick);

    this.#popupContainer = this.#popupComponent.container;

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#popupStatus === PopupStatus.OPENED) {
      replace(this.#popupComponent, prevPopupComponent);
      this.#setPopupClickHandlers();
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popupComponent);
  };

  removePopupView = () => {
    if (this.#popupStatus === PopupStatus.OPENED) {
      remove(this.#popupComponent);
    }
  };

  #setPopupClickHandlers = () => {
    this.#popupComponent.setClickHandler(this.#closePopup);
    this.#popupComponent.setWatchlistClickHandler(this.#onPopupWatchlistControlClick);
    this.#popupComponent.setWatchedClickHandler(this.#onPopupWatchedControlClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onPopupFavoriteControlClick);
  };

  #renderPopup = () => {
    fixScrollbarOpen();

    render(this.#popupComponent, this.#popupContainer);
    this.#popupComponent.bodyAddHideOverflow();

    this.#setPopupClickHandlers();

    this.#popupStatus = PopupStatus.OPENED;

    document.addEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #closePopup = () => {
    fixScrollbarClose();

    this.#changePopupStatusToClose();
    this.#popupStatus = PopupStatus.CLOSED;

    this.#popupComponent.bodyRemoveHideOverflow();
    document.removeEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #onPopupEscapeKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

  #onFilmCardClick = () => {
    if (this.#popupComponent.checkPopupPresence()) {
      this.#closePopup();
      this.#renderPopup();
    } else {
      this.#renderPopup();
    }
  };

  #onWatchlistControlClick = () => {
    this.#film.userDetails.watchlist = !(this.#film.userDetails.watchlist);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, Filter.WATCHLIST);
  };

  #onWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, Filter.WATCHED);
  };

  #onFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, Filter.FAVORITES);
  };

  #onPopupWatchlistControlClick = () => {
    this.#film.userDetails.watchlist = !(this.#film.userDetails.watchlist);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, Filter.WATCHLIST);
  };

  #onPopupWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, Filter.WATCHED);
  };

  #onPopupFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, Filter.FAVORITES);
  };
}
