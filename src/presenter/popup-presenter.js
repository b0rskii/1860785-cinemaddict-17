import PopupView from '../view/popup-view.js';
import PopupControlsView from '../view/popup-controls-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';
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
  #comments = [];

  #popupComponent = null;
  #popupPresenter = null;
  #prevPopupComponent = null;
  #popupContainer = null;
  #controlsComponent = null;
  #commentsComponent = null;
  #newCommentComponent = null;

  #popupStatus = Popup.NOT_RENDERED;
  #changeData = null;

  constructor (changeData, popupPresenter, prevPopupComponent) {
    this.#changeData = changeData;
    this.#popupPresenter = popupPresenter;
    this.#prevPopupComponent = prevPopupComponent;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;

    const prevControlsComponent = this.#controlsComponent;
    const prevCommentsComponent = this.#commentsComponent;

    this.#popupComponent = new PopupView(film);
    this.#popupContainer = this.#popupComponent.container;
    this.#controlsComponent = new PopupControlsView(film);
    this.#commentsComponent = new PopupCommentsView(film, comments);
    this.#newCommentComponent = new PopupNewCommentView(film, comments);

    if (this.#prevPopupComponent.size === 0) {
      this.#renderPopup();
      this.#prevPopupComponent.set(this.#film.id, this.#popupComponent);
      this.#popupStatus = Popup.RENDERED;
      return;
    }

    if (this.#popupStatus === Popup.RENDERED) {
      replace(this.#controlsComponent, prevControlsComponent);
      replace(this.#commentsComponent, prevCommentsComponent);
      this.#setPopupHandlers();
    }

    remove(prevControlsComponent);
    remove(prevCommentsComponent);
  };

  destroy = () => {
    remove(this.#popupComponent);
    document.removeEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #setPopupHandlers = () => {
    this.#popupComponent.setClickHandler(this.#closePopup);
    this.#controlsComponent.setWatchlistClickHandler(this.#onPopupWatchlistControlClick);
    this.#controlsComponent.setWatchedClickHandler(this.#onPopupWatchedControlClick);
    this.#controlsComponent.setFavoriteClickHandler(this.#onPopupFavoriteControlClick);
    this.#commentsComponent.setDeleteButtonClickHandler(this.#onCommentDeleteButtonClick);
  };

  #renderPopup = () => {
    fixScrollbarOpen();

    render(this.#popupComponent, this.#popupContainer);
    render(this.#controlsComponent, this.#popupComponent.controlsContainer);
    render(this.#commentsComponent, this.#popupComponent.commentsContainer);
    render(this.#newCommentComponent, this.#popupComponent.commentsContainer);

    this.#newCommentComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#popupComponent.bodyAddHideOverflow();

    this.#setPopupHandlers();

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
  };

  #onPopupEscapeKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

  #onPopupWatchlistControlClick = () => {
    this.#film.userDetails.watchlist = !(this.#film.userDetails.watchlist);
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MAJOR, this.#film);
  };

  #onPopupWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MAJOR, this.#film);
  };

  #onPopupFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MAJOR, this.#film);
  };

  #onCommentDeleteButtonClick = (commentId) => {
    const comment = this.#comments.find((item) => item.id === Number(commentId));
    this.#film.comments = this.#film.comments.filter((item) => item !== Number(commentId));

    this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, comment);
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #onFormSubmit = (newComment) => {
    this.#film.comments.push(newComment.id);

    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, this.#film);
    this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, newComment);
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };
}
