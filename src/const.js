const FilterTitle = {
  All: 'All movies',
  WATCHLIST: 'Watchlist',
  WATCHED: 'History',
  FAVORITES: 'Favorites'
};

const Filter = {
  WATCHLIST: 'WATCHLIST',
  WATCHED: 'WATCHED',
  FAVORITES: 'FAVORITES'
};

const ActiveClass = {
  FILM_CARD_CONTROL: 'film-card__controls-item--active',
  FILM_POPUP_CONTROL: 'film-details__control-button--active',
  NAVIGATION_ITEM: 'main-navigation__item--active',
  SORT_ITEM: 'sort__button--active'
};

const UserRank = {
  NOVICE: {
    MIN: 1,
    MAX: 10,
    TEXT_CONTENT: 'Novice'
  },
  FAN: {
    MIN: 11,
    MAX: 20,
    TEXT_CONTENT: 'Fan'
  },
  MOVIE_BUFF: {
    MIN: 21,
    TEXT_CONTENT: 'Movie Buff'
  }
};

export {FilterTitle, Filter, ActiveClass, UserRank};
