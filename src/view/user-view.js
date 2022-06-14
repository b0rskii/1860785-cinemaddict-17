import AbstractView from '../framework/view/abstract-view.js';
import {UserRank} from '../const.js';

export default class UserView extends AbstractView {
  #watchedFilmsCount = null;
  #userRank = null;

  constructor (films) {
    super();
    this.#watchedFilmsCount = films.length;
    this.#userRank = this.#defineUserRank();
  }

  get template() {
    return `<section class="header__profile profile">
              <p class="profile__rating">${this.#userRank}</p>
              <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
            </section>`;
  }

  #defineUserRank = () => {
    if (this.#watchedFilmsCount < 1) {
      this.element.querySelector('.profile__rating').remove();
    }

    if (this.#watchedFilmsCount >= UserRank.NOVICE.MIN && this.#watchedFilmsCount <= UserRank.NOVICE.MAX) {
      return UserRank.NOVICE.TEXT_CONTENT;
    }

    if (this.#watchedFilmsCount >= UserRank.FAN.MIN && this.#watchedFilmsCount <= UserRank.FAN.MAX) {
      return UserRank.FAN.TEXT_CONTENT;
    }

    if (this.#watchedFilmsCount >= UserRank.MOVIE_BUFF.MIN) {
      return UserRank.MOVIE_BUFF.TEXT_CONTENT;
    }
  };
}
