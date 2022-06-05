import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {Emoji} from '../const.js';
import {checkReaction, isEmojiChecked} from '../utils/film.js';
import he from 'he';

export default class PopupNewCommentView extends AbstractStatefulView {
  constructor (film) {
    super();
    this._state = this.#convertFilmToState(film);

    this.#setInnerHandlers();
  }

  get template() {
    return `<div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${checkReaction(this._state.emotion)}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${this._state.comment}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="${Emoji.SMILE}" ${isEmojiChecked(Emoji.SMILE, this._state.emotion)}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="${Emoji.SLEEPING}" ${isEmojiChecked(Emoji.SLEEPING, this._state.emotion)}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="${Emoji.PUKE}" ${isEmojiChecked(Emoji.PUKE, this._state.emotion)}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="${Emoji.ANGRY}" ${isEmojiChecked(Emoji.ANGRY, this._state.emotion)}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>`;
  }

  #convertFilmToState = (film) => ({...film,
    emotion: '',
    comment: ''
  });

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#onEmojiClick);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#onNewCommentInput);
  };

  #onEmojiClick = (evt) => {
    if (evt.target.matches('img')) {
      const input = evt.target.parentElement.previousElementSibling;
      const update = {};

      switch (input.value) {
        case Emoji.SMILE:
          update.emotion = Emoji.SMILE;
          break;
        case Emoji.SLEEPING:
          update.emotion = Emoji.SLEEPING;
          break;
        case Emoji.PUKE:
          update.emotion = Emoji.PUKE;
          break;
        case Emoji.ANGRY:
          update.emotion = Emoji.ANGRY;
          break;
      }

      this.updateElement(update);
    }
  };

  #onNewCommentInput = (evt) => {
    this._setState({
      comment: evt.target.value
    });
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.closest('form').addEventListener('keydown', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey) && this._state.emotion !== '') {
      const newComment = {
        comment: he.encode(this._state.comment),
        emotion: this._state.emotion
      };

      this._callback.formSubmit(newComment);

      this.updateElement({
        emotion: '',
        comment: ''
      });
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };
}
