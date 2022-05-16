import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view.js';
import {fixScrollbarOpen, fixScrollbarClose} from '../utils/common.js';
import {render, remove, replace} from '../framework/render.js';

const PopupStatus = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED'
};

export default class FilmPresenter {
  #container = null;

  #film = null;
  #filmComments = null;
  #filmComponent = null;
  #popupComponent = null;

  #popupStatus = PopupStatus.CLOSED;
  #changeData = null;
  #changePopupStatus = null;

  constructor (container, changeData, changePopupStatus) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changePopupStatus = changePopupStatus;
  }

  init = (film, filmComments) => {
    this.#film = film;
    this.#filmComments = filmComments;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#popupComponent = new PopupView(film, filmComments);

    this.#filmComponent.setClickHandler(this.#onFilmCardClick);
    this.#filmComponent.setWatchlistClickHandler(this.#onWatchlistControlClick);
    this.#filmComponent.setWatchedClickHandler(this.#onWatchedControlClick);
    this.#filmComponent.setFavoriteClickHandler(this.#onFavoriteControlClick);

    this.#popupComponent.setClickHandler(this.#closePopup);
    this.#popupComponent.setWatchlistClickHandler(this.#onPopupWatchlistControlClick);
    this.#popupComponent.setWatchedClickHandler(this.#onPopupWatchedControlClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onPopupFavoriteControlClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#popupStatus === PopupStatus.OPENED) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popupComponent);
  };

  resetPopupView = () => {
    if (this.#popupStatus === PopupStatus.OPENED) {
      remove(this.#popupComponent);
    }
  };

  #closePopup = () => {
    fixScrollbarClose();
    this.#changePopupStatus();
    this.#popupStatus = PopupStatus.CLOSED;
    // if (body.querySelector('.film-details')) {
    //   body.querySelector('.film-details').remove();
    // }
    const body = document.querySelector('body');
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #onPopupEscapeKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

  #onFilmCardClick = (evt) => {
    if (evt.target.closest('.film-card') && !evt.target.classList.contains('film-card__controls-item')) {
      // const popupComponent = new PopupView(this.#film, this.#filmComments);
      const body = document.querySelector('body');

      const renderPopup = () => {
        fixScrollbarOpen();
        render(this.#popupComponent, body);
        body.classList.add('hide-overflow');
        this.#popupStatus = PopupStatus.OPENED;

        // this.#popupComponent.setClickHandler(this.#closePopup);
        // this.#popupComponent.setWatchlistClickHandler(this.#onPopupWatchlistControlClick);
        // this.#popupComponent.setWatchedClickHandler(this.#onPopupWatchedControlClick);
        // this.#popupComponent.setFavoriteClickHandler(this.#onPopupFavoriteControlClick);

        document.addEventListener('keydown', this.#onPopupEscapeKeydown);
      };

      if (body.querySelector('.film-details')) {
        this.#closePopup();
        renderPopup();
      } else {
        renderPopup();
      }
    }
  };

  #onWatchlistControlClick = () => {
    this.#film.userDetails.watchlist = !(this.#film.userDetails.watchlist);
    this.#changeData(this.#film);
  };

  #onWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#changeData(this.#film);
  };

  #onFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#changeData(this.#film);
  };

  #onPopupWatchlistControlClick = () => {
    this.#film.userDetails.watchlist = !(this.#film.userDetails.watchlist);
    this.#changeData(this.#film);
  };

  #onPopupWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#changeData(this.#film);
  };

  #onPopupFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#changeData(this.#film);
  };
}
