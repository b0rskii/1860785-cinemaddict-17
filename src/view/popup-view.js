import {createElement} from '../render.js';
import {formatRuntime, formatDate} from '../util.js';

const Format = {
  RELEASE_DATE: 'DD MMMM YYYY',
  COMMENT_DATE: 'YYYY/MM/DD HH:MM'
};

const createGenreTemplate = (genres) => {
  const elements = [];

  genres.forEach((item) => elements.push(`<span class="film-details__genre">${item}</span>`));

  return elements.join('');
};

const getFilmComments = (film, comments) => {
  const filmComments = [];

  film.commentsId.forEach((item) => {
    for (let i = 0; i < comments.length; i++) {
      if (item === comments[i].id) {
        filmComments.push(comments[i]);
        break;
      }
    }
  });

  return filmComments;
};

const createCommentsTemplate = (comments) => {
  const elements = [];

  comments.forEach((item) => elements.push(
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${item.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${formatDate(item.date, Format.COMMENT_DATE)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  ));

  return elements.join('');
};

export default class PopupView {
  constructor (film, comments) {
    this.film = film;
    this.poster = film.filmInfo.poster;
    this.ageRating = film.filmInfo.ageRating;
    this.title = film.filmInfo.title;
    this.alternativeTitle = film.filmInfo.alternativeTitle;
    this.totalRating = film.filmInfo.totalRating;
    this.director = film.filmInfo.director;
    this.writers = film.filmInfo.writers;
    this.actors = film.filmInfo.actors;
    this.releaseDate = film.filmInfo.release.date;
    this.runtime = film.filmInfo.runtime;
    this.releaseCountry = film.filmInfo.release.releaseCountry;
    this.genre = film.filmInfo.genre;
    this.genresTerm = this.genre.length > 1 ? 'Genres' : 'Genre';
    this.description = film.filmInfo.description;
    this.commentCount = film.commentsId.length;
    this.filmComments = getFilmComments(film, comments);
  }

  getTemplate() {
    return `<section class="film-details">
              <form class="film-details__inner" action="" method="get">
                <div class="film-details__top-container">
                  <div class="film-details__close">
                    <button class="film-details__close-btn" type="button">close</button>
                  </div>
                  <div class="film-details__info-wrap">
                    <div class="film-details__poster">
                      <img class="film-details__poster-img" src=${this.poster} alt="">

                      <p class="film-details__age">${this.ageRating}+</p>
                    </div>

                    <div class="film-details__info">
                      <div class="film-details__info-head">
                        <div class="film-details__title-wrap">
                          <h3 class="film-details__title">${this.title}</h3>
                          <p class="film-details__title-original">Original: ${this.alternativeTitle}</p>
                        </div>

                        <div class="film-details__rating">
                          <p class="film-details__total-rating">${this.totalRating}</p>
                        </div>
                      </div>

                      <table class="film-details__table">
                        <tr class="film-details__row">
                          <td class="film-details__term">Director</td>
                          <td class="film-details__cell">${this.director}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Writers</td>
                          <td class="film-details__cell">${this.writers.join(', ')}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Actors</td>
                          <td class="film-details__cell">${this.actors.join(', ')}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Release Date</td>
                          <td class="film-details__cell">${formatDate(this.releaseDate, Format.RELEASE_DATE)}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Runtime</td>
                          <td class="film-details__cell">${formatRuntime(this.runtime)}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">Country</td>
                          <td class="film-details__cell">${this.releaseCountry}</td>
                        </tr>
                        <tr class="film-details__row">
                          <td class="film-details__term">${this.genresTerm}</td>
                          <td class="film-details__cell">
                            ${createGenreTemplate(this.genre)}
                          </td>
                        </tr>
                      </table>

                      <p class="film-details__film-description">
                        ${this.description}
                      </p>
                    </div>
                  </div>

                  <section class="film-details__controls">
                    <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
                    <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
                    <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
                  </section>
                </div>

                <div class="film-details__bottom-container">
                  <section class="film-details__comments-wrap">
                    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this.commentCount}</span></h3>

                    <ul class="film-details__comments-list">
                      ${createCommentsTemplate(this.filmComments)}
                    </ul>

                    <div class="film-details__new-comment">
                      <div class="film-details__add-emoji-label"></div>

                      <label class="film-details__comment-label">
                        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                      </label>

                      <div class="film-details__emoji-list">
                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                        <label class="film-details__emoji-label" for="emoji-smile">
                          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                        </label>

                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                        <label class="film-details__emoji-label" for="emoji-sleeping">
                          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                        </label>

                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                        <label class="film-details__emoji-label" for="emoji-puke">
                          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                        </label>

                        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                        <label class="film-details__emoji-label" for="emoji-angry">
                          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                        </label>
                      </div>
                    </div>
                  </section>
                </div>
              </form>
            </section>`;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
