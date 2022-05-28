import {FilterType} from '../const.js';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((item) => item.userDetails.watchlist === true),
  [FilterType.WATCHED]: (films) => films.filter((item) => item.userDetails.alreadyWatched === true),
  [FilterType.FAVORITES]: (films) => films.filter((item) => item.userDetails.favorite === true),
};

export {filter};
