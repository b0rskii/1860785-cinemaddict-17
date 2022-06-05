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
  #handleViewAction = null;

  constructor (handleViewAction, popupPresenter, prevPopupComponent) {
    this.#handleViewAction = handleViewAction;
    this.#popupPresenter = popupPresenter;
    this.#prevPopupComponent = prevPopupComponent;
  }

  init = async (film, getFilmComments) => {
    this.#film = film;
    this.#comments = await getFilmComments(film.id);

    const prevControlsComponent = this.#controlsComponent;
    const prevCommentsComponent = this.#commentsComponent;
    const prevNewCommentComponent = this.#newCommentComponent;

    this.#popupComponent = new PopupView(film);
    this.#popupContainer = this.#popupComponent.container;
    this.#controlsComponent = new PopupControlsView(film);
    this.#commentsComponent = new PopupCommentsView(this.#comments);
    this.#newCommentComponent = new PopupNewCommentView(film);

    if (this.#prevPopupComponent.size === 0) {
      this.#renderPopup();
      this.#prevPopupComponent.set(this.#film.id, this.#popupComponent);
      this.#popupStatus = Popup.RENDERED;
      return;
    }

    if (this.#popupStatus === Popup.RENDERED) {
      replace(this.#controlsComponent, prevControlsComponent);
      replace(this.#commentsComponent, prevCommentsComponent);
      replace(this.#newCommentComponent, prevNewCommentComponent);
      this.#setPopupHandlers();
    }

    remove(prevControlsComponent);
    remove(prevCommentsComponent);
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
    this.#commentsComponent.setDeleteButtonClickHandler(this.#onCommentDeleteButtonClick);
    this.#newCommentComponent.setFormSubmitHandler(this.#onFormSubmit);
  };

  #renderPopup = () => {
    fixScrollbarOpen();

    render(this.#popupComponent, this.#popupContainer);
    render(this.#controlsComponent, this.#popupComponent.controlsContainer);
    render(this.#commentsComponent, this.#popupComponent.commentsContainer);
    render(this.#newCommentComponent, this.#popupComponent.commentsContainer);

    this.#setPopupHandlers();
    this.#popupComponent.bodyAddHideOverflow();
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
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, this.#film);
  };

  #onPopupWatchedControlClick = () => {
    this.#film.userDetails.alreadyWatched = !(this.#film.userDetails.alreadyWatched);
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, this.#film);
  };

  #onPopupFavoriteControlClick = () => {
    this.#film.userDetails.favorite = !(this.#film.userDetails.favorite);
    this.#handleViewAction(UserAction.UPDATE_FILM_POPUP, UpdateType.MAJOR, this.#film);
  };

  #onCommentDeleteButtonClick = async (commentId) => {
    const film = this.#film;
    const comment = this.#comments.find((item) => item.id === commentId);

    await this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.PATCH, {film, comment});
    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };

  #onFormSubmit = async (newComment) => {
    const film = this.#film;

    await this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, {film, newComment});
    this.#handleViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, this.#film);
  };
}
