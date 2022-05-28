import PopupView from '../view/popup-view.js';
import PopupControlsView from '../view/popup-controls-view.js';
import PopupNewCommentView from '../view/popup-new-comment-view.js';
import {fixScrollbarOpen, fixScrollbarClose} from '../utils/common.js';
import {render, remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

const Popup = {
  RENDERED: 'RENDERED',
  NOT_RENDERED: 'NOT_RENDERED'
};

export default class PopupPresenter {
  #film = null;

  #popupComponent = null;
  #popupPresenter = null;
  #prevPopupComponent = null;
  #popupContainer = null;
  #controlsComponent = null;
  #newCommentComponent = null;

  #popupStatus = Popup.NOT_RENDERED;
  #changeData = null;

  constructor (changeData, popupPresenter, prevPopupComponent) {
    this.#changeData = changeData;
    this.#popupPresenter = popupPresenter;
    this.#prevPopupComponent = prevPopupComponent;
  }

  init = (film, filmComments) => {
    this.#film = film;

    const prevControlsComponent = this.#controlsComponent;

    this.#popupComponent = new PopupView(film, filmComments);
    this.#popupContainer = this.#popupComponent.container;
    this.#controlsComponent = new PopupControlsView(film);
    this.#newCommentComponent = new PopupNewCommentView(film);

    if (this.#prevPopupComponent.size === 0) {
      this.#renderPopup();
      this.#prevPopupComponent.set(this.#film.id, this.#popupComponent);
      this.#popupStatus = Popup.RENDERED;
      return;
    }

    if (this.#popupStatus === Popup.RENDERED) {
      replace(this.#controlsComponent, prevControlsComponent);
      this.#setPopupClickHandlers();
    }

    remove(prevControlsComponent);
  };

  destroy = () => {
    remove(this.#popupComponent);
  };

  #setPopupClickHandlers = () => {
    this.#popupComponent.setClickHandler(this.#closePopup);
    this.#controlsComponent.setWatchlistClickHandler(this.#onPopupWatchlistControlClick);
    this.#controlsComponent.setWatchedClickHandler(this.#onPopupWatchedControlClick);
    this.#controlsComponent.setFavoriteClickHandler(this.#onPopupFavoriteControlClick);
  };

  #renderPopup = () => {
    fixScrollbarOpen();

    render(this.#popupComponent, this.#popupContainer);
    render(this.#controlsComponent, this.#popupComponent.controlsContainer);
    render(this.#newCommentComponent, this.#popupComponent.newCommentContainer);
    this.#popupComponent.bodyAddHideOverflow();

    this.#setPopupClickHandlers();

    this.#popupStatus = Popup.RENDERED;

    document.addEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #closePopup = () => {
    fixScrollbarClose();

    this.destroy();
    this.#popupPresenter.clear();

    if (this.#prevPopupComponent.size > 0) {
      this.#prevPopupComponent.forEach((item) => remove(item));
      this.#prevPopupComponent.clear();
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
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #onPopupWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #onPopupFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };
}
