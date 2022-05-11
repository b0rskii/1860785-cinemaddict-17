import {Amount, generateFilm, generateComment} from '../fish/film.js';

export default class FilmsModel {
  #films = Array.from({length: Amount.FILMS}, generateFilm);
  #comments = Array.from({length: Amount.COMMENTS}, generateComment);
  #matchedComments = this.#matchCommentsWithFilms(this.#comments);
  #watchlistFilms = this.#films.filter((item) => item.userDetails.watchlist === true);
  #alreadyWatchedFilms = this.#films.filter((item) => item.userDetails.alreadyWatched === true);
  #favoriteFilms = this.#films.filter((item) => item.userDetails.favorite === true);

  get films() {
    return this.#films;
  }

  get watchlistFilms() {
    return this.#watchlistFilms;
  }

  get alreadyWatchedFilms() {
    return this.#alreadyWatchedFilms;
  }

  get favoriteFilms() {
    return this.#favoriteFilms;
  }

  get comments() {
    return this.#matchedComments;
  }

  sortByRaiting = (data = this.#films) => data.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);

  sortByCommentsCount = (data = this.#films) => data.slice().sort((a, b) => b.commentsId.length - a.commentsId.length);

  #matchCommentsWithFilms(comments) {
    const groupedComments = [];
    const originalComments = comments.slice();

    this.#films.forEach((item) => {
      const filmComments = [];

      for (let i = 0; i < item.commentsId.length; i++) {
        filmComments.push(originalComments.shift());
      }

      groupedComments.push(filmComments);
    });

    return groupedComments;
  }
}
