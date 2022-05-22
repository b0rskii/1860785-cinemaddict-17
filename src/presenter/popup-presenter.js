import PopupView from '../view/popup-view.js';
import PopupControlsView from '../view/popup-controls-view.js';
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
  #prevPopupComponent = null;
  #popupContainer = null;
  #popupControlsComponent = null;

  #popupStatus = Popup.NOT_RENDERED;
  #changeData = null;
  #changeFilter = null;

  constructor (changeData, changeFilter, prevPopupComponent) {
    this.#changeData = changeData;
    this.#changeFilter = changeFilter;
    this.#prevPopupComponent = prevPopupComponent;
  }

  init = (film, filmComments) => {
    this.#film = film;

    const prevPopupControlsComponent = this.#popupControlsComponent;

    this.#popupComponent = new PopupView(film, filmComments);
    this.#popupContainer = this.#popupComponent.container;
    this.#popupControlsComponent = new PopupControlsView(film);

    if (this.#prevPopupComponent.size === 0) {
      this.#renderPopup();
      this.#prevPopupComponent.set(this.#film.id, this.#popupComponent);
      this.#popupStatus = Popup.RENDERED;
      return;
    }

    if (this.#popupStatus === Popup.RENDERED) {
      replace(this.#popupControlsComponent, prevPopupControlsComponent);
      this.#setPopupClickHandlers();
    }

    remove(prevPopupControlsComponent);
  };

  destroy = () => {
    remove(this.#popupComponent);
  };

  #setPopupClickHandlers = () => {
    this.#popupComponent.setClickHandler(this.#closePopup);
    this.#popupControlsComponent.setWatchlistClickHandler(this.#onPopupWatchlistControlClick);
    this.#popupControlsComponent.setWatchedClickHandler(this.#onPopupWatchedControlClick);
    this.#popupControlsComponent.setFavoriteClickHandler(this.#onPopupFavoriteControlClick);
  };

  #renderPopup = () => {
    fixScrollbarOpen();

    render(this.#popupComponent, this.#popupContainer);
    render(this.#popupControlsComponent, this.#popupComponent.controlsContainer);
    this.#popupComponent.bodyAddHideOverflow();

    this.#setPopupClickHandlers();

    this.#popupStatus = Popup.RENDERED;

    document.addEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #closePopup = () => {
    fixScrollbarClose();

    this.destroy();
    if (this.#prevPopupComponent.size > 0) {
      this.#prevPopupComponent.forEach((item) => remove(item));
    }
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
