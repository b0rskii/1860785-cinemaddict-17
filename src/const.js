const FilterType = {
  ALL: 'ALL',
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

const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RAITING: 'by-raiting'
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

const Emoji = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
  SMILE_IMG: '<img src="./images/emoji/smile.png" width="55" height="55" alt="emoji">',
  SLEEPING_IMG: '<img src="./images/emoji/sleeping.png" width="55" height="55" alt="emoji">',
  PUKE_IMG: '<img src="./images/emoji/puke.png" width="55" height="55" alt="emoji">',
  ANGRY_IMG: '<img src="./images/emoji/angry.png" width="55" height="55" alt="emoji">'
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  UPDATE_FILM_POPUP: 'UPDATE_FILM_POPUP',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

const UpdateType = {
  INIT: 'INIT',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST'
};

export {
  FilterType,
  ActiveClass,
  SortType,
  UserRank,
  Emoji,
  UserAction,
  UpdateType,
  Method
};
