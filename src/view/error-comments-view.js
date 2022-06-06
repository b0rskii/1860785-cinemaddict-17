import AbstractView from '../framework/view/abstract-view.js';

export default class ErrorCommentsView extends AbstractView {
  get template() {
    return '<h3 class="film-details__comments-title">Failed to load comments</h3>';
  }
}
