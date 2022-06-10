import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {addClassByCondition} from '../utils/common.js';
import {ActiveClass} from '../const.js';

export default class PopupControlsView extends AbstractStatefulView {
  #isWatchlistFilm = null;
  #isWatchedFilm = null;
  #isFavoriteFilm = null;

  constructor (film) {
    super();
    this._state = this.#convertDataToState(film);
    this.#isWatchlistFilm = this._state.userDetails.watchlist;
    this.#isWatchedFilm = this._state.userDetails.alreadyWatched;
    this.#isFavoriteFilm = this._state.userDetails.favorite;
  }

  get template() {
    return `<section class="film-details__controls">
              <button ${this._state.isDisabled ? 'disabled' : ''} type="button" class="film-details__control-button film-details__control-button--watchlist ${addClassByCondition(this.#isWatchlistFilm, ActiveClass.FILM_POPUP_CONTROL)}" id="watchlist" name="watchlist">Add to watchlist</button>
              <button ${this._state.isDisabled ? 'disabled' : ''} type="button" class="film-details__control-button film-details__control-button--watched ${addClassByCondition(this.#isWatchedFilm, ActiveClass.FILM_POPUP_CONTROL)}" id="watched" name="watched">Already watched</button>
              <button ${this._state.isDisabled ? 'disabled' : ''} type="button" class="film-details__control-button film-details__control-button--favorite ${addClassByCondition(this.#isFavoriteFilm, ActiveClass.FILM_POPUP_CONTROL)}" id="favorite" name="favorite">Add to favorites</button>
            </section>`;
  }

  #convertDataToState = (data) => ({...data,
    isDisabled: false
  });

  _restoreHandlers = () => {
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #watchlistClickHandler = () => {
    this._callback.watchlistClick();
  };

  #watchedClickHandler = () => {
    this._callback.watchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
