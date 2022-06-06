import PopupView from '../view/popup-view.js';
import PopupControlsView from '../view/popup-controls-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';
import PopupNewCommentView from '../view/popup-new-comment-view.js';
import ErrorCommentsView from '../view/error-comments-view.js';
import {fixScrollbarOpen, fixScrollbarClose} from '../utils/common.js';
import {render, remove, replace} from '../framework/render.js';
import {RenderPosition} from '../framework/render.js';
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
  #getFilmComments = null;

  #popupStatus = Popup.NOT_RENDERED;
  #handleViewAction = null;

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
    document.removeEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  setSaving = (actionType) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#newCommentComponent.updateElement({
          emotion: '',
          comment: '',
          isDisabled: true
        });
        break;
      case UserAction.UPDATE_FILM_POPUP:
        this.#controlsComponent.updateElement({
          isDisabled: true
        });
        break;
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
    }
    if (actionType === UserAction.ADD_COMMENT) {
      const resetFormState = () => {
        this.#newCommentComponent.updateElement({
          emotion: '',
          comment: '',
          isDisabled: false
        });
      };

      this.#newCommentComponent.shake(resetFormState);
    }

    if (actionType === UserAction.DELETE_COMMENT) {
      const resetCommentsState = () => {
        this.#commentsComponent.updateElement({
          deletingCommentId: ''
        });
      };

      this.#commentsComponent.shake(resetCommentsState);
    }
  };

  #setPopupHandlers = () => {
    this.#popupComponent.setClickHandler(this.#closePopup);
    this.#controlsComponent.setWatchlistClickHandler(this.#onPopupWatchlistControlClick);
    this.#controlsComponent.setWatchedClickHandler(this.#onPopupWatchedControlClick);
    this.#controlsComponent.setFavoriteClickHandler(this.#onPopupFavoriteControlClick);
    this.#newCommentComponent.setFormSubmitHandler(this.#onFormSubmit);
  };

  #renderComments = async () => {
    this.#comments = await this.#getFilmComments(this.#film.id);

    if (this.#comments === null) {
      render(new ErrorCommentsView(), this.#popupComponent.commentsContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    const newCommentsComponent = new PopupCommentsView(this.#comments);

    if (this.#popupComponent.checkCommentsRenderStatus()) {
      replace(newCommentsComponent, this.#commentsComponent);
      this.#commentsComponent = newCommentsComponent;
      this.#commentsComponent.setDeleteButtonClickHandler(this.#onCommentDeleteButtonClick);
      return;
    }

    this.#commentsComponent = newCommentsComponent;
    render(this.#commentsComponent, this.#popupComponent.commentsContainer, RenderPosition.AFTERBEGIN);
    this.#commentsComponent.setDeleteButtonClickHandler(this.#onCommentDeleteButtonClick);
  };

  #renderPopup = () => {
    fixScrollbarOpen();

    render(this.#popupComponent, this.#popupContainer);
    render(this.#controlsComponent, this.#popupComponent.controlsContainer);
    render(this.#newCommentComponent, this.#popupComponent.commentsContainer);

    this.#setPopupHandlers();
    this.#popupComponent.bodyAddHideOverflow();
    this.#popupStatus = Popup.RENDERED;

    document.addEventListener('keydown', this.#onPopupEscapeKeydown);

    this.#renderComments();
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
    const film = JSON.parse(JSON.stringify(this.#film));

    film.userDetails.watchlist = !(film.userDetails.watchlist);
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, film);
  };

  #onPopupWatchedControlClick = () => {
    const film = JSON.parse(JSON.stringify(this.#film));

    film.userDetails.alreadyWatched = !(film.userDetails.alreadyWatched);
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, film);
  };

  #onPopupFavoriteControlClick = () => {
    const film = JSON.parse(JSON.stringify(this.#film));

    film.userDetails.favorite = !(film.userDetails.favorite);
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, film);
  };

  #onCommentDeleteButtonClick = async (commentId) => {
    const film = this.#film;
    const comment = this.#comments.find((item) => item.id === commentId);

    await this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MINOR, {film, comment});
  };

  #onFormSubmit = async (newComment) => {
    const film = this.#film;

    await this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MINOR, {film, newComment});
  };
}
