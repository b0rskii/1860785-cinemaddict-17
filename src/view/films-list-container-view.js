import AbstractView from '../framework/view/abstract-view.js';

export default class FilmsListContainerView extends AbstractView {
  get template() {
    return '<div class="films-list__container"></div>';
  }
}
