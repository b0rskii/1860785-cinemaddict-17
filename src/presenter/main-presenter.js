import FilmPresenter from './film-presenter.js';
import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import ExtraSectionView from '../view/extra-section-view.js';
import {render, remove, replace} from '../framework/render.js';
import {FilterTitle, Filter, ActiveClass} from '../const.js';
import {updateItem} from '../utils/common.js';

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
  #filmPresenter = new Map();
  #filmPresenterExtra = new Map();
  #renderedFilmCardsCount = 0;

  #navigationComponent = null;
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

    this.#navigationComponent = new NavigationView(this.#watchlistFilms, this.#alreadyWatchedFilms, this.#favoriteFilms);

    this.#renderNavigation();
    this.#renderSort();
    this.#renderFilms();
  };

  #renderNavigation = () => {
    render(this.#navigationComponent, this.#container);
    this.#navigationComponent.setClickHandler(this.#onFilterClick);
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

  #handlePopupStatusChange = () => {
    this.#filmPresenter.forEach((item) => item.removePopupView());
    this.#filmPresenterExtra.forEach((item) => item.removePopupView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#mainFilms = updateItem(this.#mainFilms, updatedFilm);

    const renderedFilmsIndificators = this.#filmPresenter.keys();
    for (const renderedFilmId of renderedFilmsIndificators) {
      if (renderedFilmId === updatedFilm.id) {
        this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#comments[updatedFilm.id - 1]);
      }
    }

    const extraFilmsIndificators = this.#filmPresenterExtra.keys();
    for (const extraFilmId of extraFilmsIndificators) {
      if (extraFilmId === updatedFilm.id) {
        this.#filmPresenterExtra.get(updatedFilm.id).init(updatedFilm, this.#comments[updatedFilm.id - 1]);
      }
    }
  };

  #handleFilterChange = (film, filter) => {
    switch (filter) {
      case Filter.WATCHLIST:
        if (film.userDetails.watchlist) {
          this.#watchlistFilms.push(film);
        } else {
          this.#watchlistFilms = this.#watchlistFilms.filter((item) => item !== film);
        }
        break;
      case Filter.WATCHED:
        if (film.userDetails.alreadyWatched) {
          this.#alreadyWatchedFilms.push(film);
        } else {
          this.#alreadyWatchedFilms = this.#alreadyWatchedFilms.filter((item) => item !== film);
        }
        break;
      case Filter.FAVORITES:
        if (film.userDetails.favorite) {
          this.#favoriteFilms.push(film);
        } else {
          this.#favoriteFilms = this.#favoriteFilms.filter((item) => item !== film);
        }
        break;
    }

    const newNavigationComponent = new NavigationView(this.#watchlistFilms, this.#alreadyWatchedFilms, this.#favoriteFilms);

    replace(newNavigationComponent, this.#navigationComponent);
    this.#navigationComponent = newNavigationComponent;
    this.#navigationComponent.setClickHandler(this.#onFilterClick);
  };

  #renderFilm = (filmData, container) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#handlePopupStatusChange, this.#handleFilterChange);
    const filmComments = this.#comments[filmData.id - 1];
    filmPresenter.init(filmData, filmComments);

    if (container === this.#filmsListContainerComponent.element) {
      this.#filmPresenter.set(filmData.id, filmPresenter);
    } else {
      this.#filmPresenterExtra.set(filmData.id, filmPresenter);
    }
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

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((item) => item.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCardsCount = 0;
    remove(this.#showMoreButtonComponent);
  };

  #onFilterClick = (evt) => {
    const renderFilterFilms = (target) => {
      this.#clearFilmsList();

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
