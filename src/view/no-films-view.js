import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const EmptyFilterMessage = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  WATCHED: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now'
};

export default class NoFilmsView extends AbstractView {
  #currentFilterMessage = null;

  constructor (currentFilter) {
    super();
    this.#currentFilterMessage = this.#defineMessage(currentFilter);
  }

  get template() {
    return `<section class="films-list">
              <h2 class="films-list__title">${this.#currentFilterMessage}</h2>
            </section>`;
  }

  #defineMessage = (filter) => {
    switch (filter) {
      case FilterType.WATCHLIST:
        return EmptyFilterMessage.WATCHLIST;
      case FilterType.WATCHED:
        return EmptyFilterMessage.WATCHED;
      case FilterType.FAVORITES:
        return EmptyFilterMessage.FAVORITES;
      default:
        return EmptyFilterMessage.ALL;
    }
  };
}
