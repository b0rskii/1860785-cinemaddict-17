import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import ExtraSectionView from '../view/extra-section-view.js';
import PopupView from '../view/popup-view.js';
import {render, remove} from '../framework/render.js';
import {fixScrollbarOpen, fixScrollbarClose} from '../utils/common.js';
import {FilterTitle, ActiveClass} from '../const.js';

const RenderCount = {
  FILM_CARDS: 5,
  FILM_CARDS_EXTRA: 2
};

const Title = {
  FIRST_EXTRA_SECTION: 'Top rated',
  SECOND_EXTRA_SECTION: 'Most commented'
};

export default class MainPresenter {
  #container = null;
  #filmsModel = null;

  #mainFilms = [];
  #watchlistFilms = [];
  #alreadyWatchedFilms = [];
  #favoriteFilms = [];
  #comments = [];
  #mainFilmsRaitingSorted = [];
  #mainFilmsCommentsCountSorted = [];
  #renderedFilmCardsCount = 0;

  #filmsSection = new FilmsSectionView();
  #filmsListSection = new FilmsListSectionView();
  #filmsListContainer = new FilmsListContainerView();
  #showMoreButton = new ShowMoreButtonView();
  #firstExtraSection = new ExtraSectionView(Title.FIRST_EXTRA_SECTION);
  #secondExtraSection = new ExtraSectionView(Title.SECOND_EXTRA_SECTION);
  #firstExtraFilmsContainer = new FilmsListContainerView();
  #secondExtraFilmsContainer = new FilmsListContainerView();

  constructor (container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#renderedFilmCardsCount = 0;
  }

  init = () => {
    this.#mainFilms = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];
    this.#watchlistFilms = [...this.#filmsModel.watchlistFilms];
    this.#alreadyWatchedFilms = [...this.#filmsModel.alreadyWatchedFilms];
    this.#favoriteFilms = [...this.#filmsModel.favoriteFilms];
    this.#mainFilmsRaitingSorted = [...this.#filmsModel.sortByRaiting()];
    this.#mainFilmsCommentsCountSorted = [...this.#filmsModel.sortByCommentsCount()];

    const navigation = new NavigationView(this.#watchlistFilms, this.#alreadyWatchedFilms, this.#favoriteFilms);

    render(navigation, this.#container);

    navigation.setClickHandler(this.#onFilterClick);

    render(new SortView(), this.#container);
    render(this.#filmsSection, this.#container);

    if (this.#mainFilms.length === 0) {
      render(new NoFilmsView(), this.#filmsSection.element);
    } else {
      render(this.#filmsListSection, this.#filmsSection.element);
      render(this.#filmsListContainer, this.#filmsListSection.element);

      this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#mainFilms);

      render(this.#firstExtraSection, this.#filmsSection.element);
      render(this.#secondExtraSection, this.#filmsSection.element);
      render(this.#firstExtraFilmsContainer, this.#firstExtraSection.element);
      render(this.#secondExtraFilmsContainer, this.#secondExtraSection.element);

      for (let i = 0; i < Math.min(RenderCount.FILM_CARDS_EXTRA, this.#mainFilms.length); i++) {
        const firstExtrafilmCardComponent = new FilmCardView(this.#mainFilmsRaitingSorted[i]);
        const secondExtraFilmCardComponent = new FilmCardView(this.#mainFilmsCommentsCountSorted[i]);

        render(firstExtrafilmCardComponent, this.#firstExtraFilmsContainer.element);
        render(secondExtraFilmCardComponent, this.#secondExtraFilmsContainer.element);

        firstExtrafilmCardComponent.setClickHandler(this.#onFilmCardClick);
        secondExtraFilmCardComponent.setClickHandler(this.#onFilmCardClick);
      }
    }
  };

  #renderPartFilmCards = (count, data) => {
    const remainingFilmCardsCount = (data.length - this.#renderedFilmCardsCount);
    let renderCount;

    if (remainingFilmCardsCount <= RenderCount.FILM_CARDS) {
      renderCount = remainingFilmCardsCount;
      remove(this.#showMoreButton);
    } else {
      renderCount = count;
    }

    for (let i = this.#renderedFilmCardsCount; i < renderCount + this.#renderedFilmCardsCount; i++) {
      const filmCardComponent = new FilmCardView(data[i]);

      render(filmCardComponent, this.#filmsListContainer.element);

      filmCardComponent.setClickHandler(this.#onFilmCardClick);
    }

    this.#renderedFilmCardsCount += renderCount;

    if (data.length === remainingFilmCardsCount && data.length > count) {
      render(this.#showMoreButton, this.#filmsListSection.element);

      this.#showMoreButton.setClickHandler(() => this.#renderPartFilmCards(count, data));
    }
  };

  #closePopup = (body) => {
    fixScrollbarClose();
    body.querySelector('.film-details').remove();
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onPopupEscapeKeydown);
  };

  #onPopupEscapeKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      const body = document.querySelector('body');

      this.#closePopup(body);
    }
  };

  #onFilmCardClick = (evt) => {
    if (evt.target.closest('.film-card') && !evt.target.classList.contains('film-card__controls-item')) {
      const filmId = evt.target.closest('.film-card').getAttribute('data-id') - 1;
      const popupComponent = new PopupView(this.#mainFilms[filmId], this.#comments[filmId]);
      const body = document.querySelector('body');

      const renderPopup = () => {
        fixScrollbarOpen();
        render(popupComponent, body);
        body.classList.add('hide-overflow');

        popupComponent.setClickHandler(() => this.#closePopup(body));

        document.addEventListener('keydown', this.#onPopupEscapeKeydown);
      };

      if (body.lastElementChild.matches('section.film-details')) {
        this.#closePopup(body);
        renderPopup();
      } else {
        renderPopup();
      }
    }
  };

  #onFilterClick = (evt) => {
    const renderFilterFilms = (target) => {
      document.querySelector('.films-list').querySelectorAll('.film-card').forEach((item) => item.remove());
      remove(this.#showMoreButton);

      this.#renderedFilmCardsCount = 0;

      if (target.textContent.includes(FilterTitle.All)) {
        this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#mainFilms);
      }

      if (target.textContent.includes(FilterTitle.WATCHLIST)) {
        this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#watchlistFilms);
      }

      if (target.textContent.includes(FilterTitle.WATCHED)) {
        this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#alreadyWatchedFilms);
      }

      if (target.textContent.includes(FilterTitle.FAVORITES)) {
        this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#favoriteFilms);
      }
    };

    if (evt.target.matches('a') && !evt.target.classList.contains(ActiveClass.NAVIGATION_ITEM)) {
      const elements = evt.target.parentElement.children;

      for (const element of elements) {
        if (element.classList.contains(ActiveClass.NAVIGATION_ITEM)) {
          element.classList.remove(ActiveClass.NAVIGATION_ITEM);
          break;
        }
      }

      evt.target.classList.add(ActiveClass.NAVIGATION_ITEM);
      renderFilterFilms(evt.target);
    }

    if (evt.target.matches('span') && !evt.target.parentElement.classList.contains(ActiveClass.NAVIGATION_ITEM)) {
      const elements = evt.target.parentElement.parentElement.children;

      for (const element of elements) {
        if (element.classList.contains(ActiveClass.NAVIGATION_ITEM)) {
          element.classList.remove(ActiveClass.NAVIGATION_ITEM);
          break;
        }
      }

      evt.target.parentElement.classList.add(ActiveClass.NAVIGATION_ITEM);
      renderFilterFilms(evt.target.parentElement);
    }
  };
}
