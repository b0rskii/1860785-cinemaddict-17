import {FilterType} from '../const.js';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((item) => item.userDetails.watchlist),
  [FilterType.WATCHED]: (films) => films.filter((item) => item.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((item) => item.userDetails.favorite),
};

export {filter};
