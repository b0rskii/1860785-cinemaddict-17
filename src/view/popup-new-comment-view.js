import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {Emoji} from '../const.js';
import {checkReaction, isEmojiChecked} from '../utils/film.js';

export default class PopupNewCommentView extends AbstractStatefulView {
  constructor (film) {
    super();
    this._state = this.#convertCommentsToState(film);

    this.#setInnerHandlers();
  }

  get template() {
    return `<div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${checkReaction(this._state.emoji)}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${this._state.commentText}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="${Emoji.SMILE}" ${isEmojiChecked(Emoji.SMILE, this._state.emoji)}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="${Emoji.SLEEPING}" ${isEmojiChecked(Emoji.SLEEPING, this._state.emoji)}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="${Emoji.PUKE}" ${isEmojiChecked(Emoji.PUKE, this._state.emoji)}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="${Emoji.ANGRY}" ${isEmojiChecked(Emoji.ANGRY, this._state.emoji)}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>`;
  }

  get emojiContainer() {
    return this.element.querySelector('.film-details__add-emoji-label');
  }

  #convertCommentsToState = (film) => ({...film,
    emoji: '',
    commentText: ''
  });

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#onEmojiClick);
    this.element.querySelector('.film-details__comment-input').addEventListener('change', this.#onNewCommentChange);
  };

  #onEmojiClick = (evt) => {
    if (evt.target.matches('img')) {
      const input = evt.target.parentElement.previousElementSibling;
      const update = {};

      switch (input.value) {
        case Emoji.SMILE:
          update.emoji = Emoji.SMILE;
          break;
        case Emoji.SLEEPING:
          update.emoji = Emoji.SLEEPING;
          break;
        case Emoji.PUKE:
          update.emoji = Emoji.PUKE;
          break;
        case Emoji.ANGRY:
          update.emoji = Emoji.ANGRY;
          break;
      }

      this.updateElement(update);
    }
  };

  #onNewCommentChange = (evt) => {
    this._setState({
      commentText: evt.target.value
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };
}
