import PopupView from '../view/popup-view.js';
import PopupControlsView from '../view/popup-controls-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';
import PopupNewCommentView from '../view/popup-new-comment-view.js';
import StatusCommentsView from '../view/status-comments-view.js';
import {fixScrollbarOpen, fixScrollbarClose} from '../utils/common.js';
import {render, remove, replace} from '../framework/render.js';
import {RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

const Popup = {
  RENDERED: 'RENDERED',
  NOT_RENDERED: 'NOT_RENDERED'
};

const CommentsMessage = {
  LOADING: 'Loading comments...',
  ERROR: 'Failed to load comments'
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
  #getFilmComments = null;
  #handleViewAction = null;

  #popupStatus = Popup.NOT_RENDERED;
  #escapeKeydownHandlerContext = null;

  constructor (handleViewAction, popupPresenter, prevPopupComponent, getFilmComments) {
    this.#handleViewAction = handleViewAction;
    this.#popupPresenter = popupPresenter;
    this.#prevPopupComponent = prevPopupComponent;
    this.#getFilmComments = getFilmComments;
  }

  init = (film) => {
    this.#film = film;

    const prevControlsComponent = this.#controlsComponent;
    const prevNewCommentComponent = this.#newCommentComponent;

    this.#popupComponent = new PopupView(film);
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
      replace(this.#newCommentComponent, prevNewCommentComponent);
      this.#renderComments();
      this.#setPopupHandlers();
    }

    remove(prevControlsComponent);
    remove(prevNewCommentComponent);
  };

  destroy = () => {
    remove(this.#popupComponent);
    this.#escapeKeydownHandlerContext.removeEscapeKeydownHandler();
  };

  setSaving = (actionType) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#newCommentComponent.updateElement({
          isDisabled: true
        });
        break;
      case UserAction.UPDATE_FILM_POPUP:
        this.#controlsComponent.updateElement({
          isDisabled: true
        });
        break;
      default:
        throw new Error('Not expected actionType value');
    }
  };

  setDeleting = (comment) => {
    this.#commentsComponent.updateElement({
      deletingCommentId: comment.id
    });
  };

  setAborting = (actionType) => {
    if (actionType === UserAction.UPDATE_FILM_POPUP) {
      const resetControlsState = () => {
        this.#controlsComponent.updateElement({
          isDisabled: false
        });
      };

      this.#controlsComponent.shake(resetControlsState);
      this.#newCommentComponent.setFormSubmitHandler(this.#formSubmitHandler);
      return;
    }

    if (actionType === UserAction.ADD_COMMENT) {
      const resetFormState = () => {
        this.#newCommentComponent.updateElement({
          isDisabled: false
        });
      };

      this.#newCommentComponent.shake(resetFormState);
      this.#newCommentComponent.setFormSubmitHandler(this.#formSubmitHandler);
      return;
    }

    if (actionType === UserAction.DELETE_COMMENT) {
      const resetCommentsState = () => {
        this.#commentsComponent.updateElement({
          deletingCommentId: ''
        });
      };

      this.#commentsComponent.shake(resetCommentsState);
      this.#newCommentComponent.setFormSubmitHandler(this.#formSubmitHandler);
      return;
    }

    throw new Error('Not expected actionType value');
  };

  #setPopupHandlers = () => {
    this.#popupComponent.setCloseButtonClickHandler(this.#closePopup);
    this.#controlsComponent.setWatchlistClickHandler(this.#watchlistControlClickHandler);
    this.#controlsComponent.setWatchedClickHandler(this.#watchedControlClickHandler);
    this.#controlsComponent.setFavoriteClickHandler(this.#favoriteControlClickHandler);
    this.#newCommentComponent.setFormSubmitHandler(this.#formSubmitHandler);
  };

  #renderComments = async () => {
    const loadingCommentsComponent = new StatusCommentsView(CommentsMessage.LOADING);
    render(loadingCommentsComponent, this.#popupComponent.commentsContainer, RenderPosition.AFTERBEGIN);

    this.#comments = await this.#getFilmComments(this.#film.id);

    if (this.#comments === null) {
      replace(new StatusCommentsView(CommentsMessage.ERROR), loadingCommentsComponent);
      return;
    }

    remove(loadingCommentsComponent);

    const newCommentsComponent = new PopupCommentsView(this.#comments);

    if (this.#popupComponent.checkCommentsRenderStatus()) {
      replace(newCommentsComponent, this.#commentsComponent);
      this.#commentsComponent = newCommentsComponent;
      this.#commentsComponent.setDeleteButtonClickHandler(this.#commentDeleteButtonClickHandler);
      return;
    }

    this.#commentsComponent = newCommentsComponent;
    render(this.#commentsComponent, this.#popupComponent.commentsContainer, RenderPosition.AFTERBEGIN);
    this.#commentsComponent.setDeleteButtonClickHandler(this.#commentDeleteButtonClickHandler);
  };

  #renderPopup = () => {
    fixScrollbarOpen();

    render(this.#popupComponent, this.#popupContainer);
    render(this.#controlsComponent, this.#popupComponent.controlsContainer);
    render(this.#newCommentComponent, this.#popupComponent.commentsContainer);
    this.#renderComments();

    this.#setPopupHandlers();
    this.#popupComponent.setEscapeKeydownHandler(this.#closePopup);
    this.#escapeKeydownHandlerContext = this.#popupComponent;

    this.#popupComponent.bodyAddHideOverflow();
    this.#popupStatus = Popup.RENDERED;
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

  #watchlistControlClickHandler = () => {
    const film = JSON.parse(JSON.stringify(this.#film));

    this.#newCommentComponent.removeFormSubmitHandler();

    film.userDetails.watchlist = !(film.userDetails.watchlist);
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, film);
  };

  #watchedControlClickHandler = () => {
    const film = JSON.parse(JSON.stringify(this.#film));

    this.#newCommentComponent.removeFormSubmitHandler();

    film.userDetails.alreadyWatched = !(film.userDetails.alreadyWatched);
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, film);
  };

  #favoriteControlClickHandler = () => {
    const film = JSON.parse(JSON.stringify(this.#film));

    this.#newCommentComponent.removeFormSubmitHandler();

    film.userDetails.favorite = !(film.userDetails.favorite);
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, film);
  };

  #commentDeleteButtonClickHandler = (commentId) => {
    const film = this.#film;
    const comment = this.#comments.find((item) => item.id === commentId);

    this.#newCommentComponent.removeFormSubmitHandler();
    this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MINOR, {film, comment});
  };

  #formSubmitHandler = (newComment) => {
    const film = this.#film;

    this.#newCommentComponent.removeFormSubmitHandler();
    this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MINOR, {film, newComment});
  };
}
