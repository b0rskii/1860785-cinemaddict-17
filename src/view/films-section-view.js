import AbstractView from '../framework/view/abstract-view.js';

export default class FilmsSectionView extends AbstractView {
  get template() {
    return '<section class="films"></section>';
  }
}
