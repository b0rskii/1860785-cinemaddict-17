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

  #sortComponent = new SortView();
  #filmsSectionComponent = new FilmsSectionView();
  #noFilmsComponent = new NoFilmsView();
  #filmsListSectionComponent = new FilmsListSectionView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #firstExtraSectionComponent = new ExtraSectionView(Title.FIRST_EXTRA_SECTION);
  #secondExtraSectionComponent = new ExtraSectionView(Title.SECOND_EXTRA_SECTION);
  #firstExtraFilmsContainerComponent = new FilmsListContainerView();
  #secondExtraFilmsContainerComponent = new FilmsListContainerView();

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

    this.#renderNavigation();
    this.#renderSort();
    this.#renderFilms();
  };

  #renderNavigation = () => {
    const navigationComponent = new NavigationView(this.#watchlistFilms, this.#alreadyWatchedFilms, this.#favoriteFilms);

    render(navigationComponent, this.#container);
    navigationComponent.setClickHandler(this.#onFilterClick);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#container);
  };

  #renderFilms = () => {
    render(this.#filmsSectionComponent, this.#container);

    if (this.#mainFilms.length === 0) {
      this.#renderNoFilms();
    } else {
      render(this.#filmsListSectionComponent, this.#filmsSectionComponent.element);
      render(this.#filmsListContainerComponent, this.#filmsListSectionComponent.element);
      this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#mainFilms);
      this.#renderExtra();
    }
  };

  #renderNoFilms = () => {
    render(this.#noFilmsComponent, this.#filmsSectionComponent.element);
  };

  #renderFilm = (filmData, container) => {
    const filmCardComponent = new FilmCardView(filmData);

    render(filmCardComponent, container);
    filmCardComponent.setClickHandler(this.#onFilmCardClick);
  };

  #renderPartFilmCards = (count, data) => {
    const remainingFilmCardsCount = (data.length - this.#renderedFilmCardsCount);
    let renderCount;

    if (remainingFilmCardsCount <= RenderCount.FILM_CARDS) {
      renderCount = remainingFilmCardsCount;
      remove(this.#showMoreButtonComponent);
    } else {
      renderCount = count;
    }

    for (let i = this.#renderedFilmCardsCount; i < renderCount + this.#renderedFilmCardsCount; i++) {
      this.#renderFilm(data[i], this.#filmsListContainerComponent.element);
    }

    this.#renderedFilmCardsCount += renderCount;

    if (data.length === remainingFilmCardsCount && data.length > count) {
      this.#renderShowMoreButton(this.#filmsListSectionComponent.element);
      this.#showMoreButtonComponent.setClickHandler(() => this.#renderPartFilmCards(count, data));
    }
  };

  #renderExtra = () => {
    render(this.#firstExtraSectionComponent, this.#filmsSectionComponent.element);
    render(this.#secondExtraSectionComponent, this.#filmsSectionComponent.element);
    render(this.#firstExtraFilmsContainerComponent, this.#firstExtraSectionComponent.element);
    render(this.#secondExtraFilmsContainerComponent, this.#secondExtraSectionComponent.element);

    for (let i = 0; i < Math.min(RenderCount.FILM_CARDS_EXTRA, this.#mainFilms.length); i++) {
      this.#renderFilm(this.#mainFilmsRaitingSorted[i], this.#firstExtraFilmsContainerComponent.element);
      this.#renderFilm(this.#mainFilmsCommentsCountSorted[i], this.#secondExtraFilmsContainerComponent.element);
    }
  };

  #renderShowMoreButton = (container) => {
    render(this.#showMoreButtonComponent, container);
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
      remove(this.#showMoreButtonComponent);

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
