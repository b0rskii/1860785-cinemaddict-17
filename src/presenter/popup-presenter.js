import PopupView from '../view/popup-view.js';
import {fixScrollbarOpen, fixScrollbarClose} from '../utils/common.js';
import {render, remove, replace} from '../framework/render.js';
import {FilterType} from '../const.js';

const Popup = {
  RENDERED: 'RENDERED',
  NOT_RENDERED: 'NOT_RENDERED'
};

export default class PopupPresenter {
  #film = null;

  #popupComponent = null;
  #popupContainer = null;

  #popupStatus = Popup.NOT_RENDERED;
  #changeData = null;
  #changeFilter = null;

  constructor (changeData, changeFilter) {
    this.#changeData = changeData;
    this.#changeFilter = changeFilter;
  }

  init = (film, filmComments) => {
    this.#film = film;

    const prevPopupComponent = this.#popupComponent;

    this.#popupComponent = new PopupView(film, filmComments);
    this.#popupContainer = this.#popupComponent.container;

    if (prevPopupComponent === null) {
      this.#renderPopup();
      this.#popupStatus = Popup.RENDERED;
      return;
    }

    if (this.#popupStatus === Popup.RENDERED) {
      replace(this.#popupComponent, prevPopupComponent);
      this.#setPopupClickHandlers();
    }

    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#popupComponent);
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

    this.#popupStatus = Popup.RENDERED;

    document.addEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #closePopup = () => {
    fixScrollbarClose();

    this.destroy();
    this.#popupStatus = Popup.NOT_RENDERED;

    this.#popupComponent.bodyRemoveHideOverflow();
    document.removeEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #onPopupEscapeKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

  #onPopupWatchlistControlClick = () => {
    this.#film.userDetails.watchlist = !(this.#film.userDetails.watchlist);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, FilterType.WATCHLIST);
  };

  #onPopupWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, FilterType.WATCHED);
  };

  #onPopupFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#changeData(this.#film);
    this.#changeFilter(this.#film, FilterType.FAVORITES);
  };
}
