import AbstractView from '../framework/view/abstract-view.js';

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return `<button class="films-list__show-more">
              Show more
            </button>`;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = () => {
    this._callback.click();
  };
}
