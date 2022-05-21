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
import {FilterType, SortType} from '../const.js';
import {updateItem} from '../utils/common.js';
import {formatDateToUnix} from '../utils/film.js';
import {RenderPosition} from '../framework/render.js';

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
  #filmPresenterFirstExtra = new Map();
  #filmPresenterSecondExtra = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #sourcedMainFilms = [];
  #renderedFilmCardsCount = 0;

  #navigationComponent = null;
  #sortComponent = new SortView();
  #filmsSectionComponent = new FilmsSectionView();
  #noFilmsComponent = new NoFilmsView(this.#currentFilterType);
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
    this.#sourcedMainFilms = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];
    this.#watchlistFilms = [...this.#filmsModel.watchlistFilms];
    this.#alreadyWatchedFilms = [...this.#filmsModel.alreadyWatchedFilms];
    this.#favoriteFilms = [...this.#filmsModel.favoriteFilms];
    this.#mainFilmsRaitingSorted = [...this.#filmsModel.sortByRaiting()];
    this.#mainFilmsCommentsCountSorted = [...this.#filmsModel.sortByCommentsCount()];

    this.#renderNavigation();
    this.#renderFilms();
  };

  #renderNavigation = () => {
    this.#navigationComponent = new NavigationView(this.#watchlistFilms, this.#alreadyWatchedFilms, this.#favoriteFilms, this.#currentFilterType);
    render(this.#navigationComponent, this.#container);
    this.#navigationComponent.setClickHandler(this.#onFilterClick);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#navigationComponent.element, RenderPosition.AFTEREND);
    this.#sortComponent.setClickHandler(this.#onSortClick);
  };

  #renderFilms = () => {
    render(this.#filmsSectionComponent, this.#container);

    if (this.#mainFilms.length === 0) {
      this.#renderNoFilms();
    } else {
      this.#renderSort();
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
    this.#filmPresenterFirstExtra.forEach((item) => item.removePopupView());
    this.#filmPresenterSecondExtra.forEach((item) => item.removePopupView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#mainFilms = updateItem(this.#mainFilms, updatedFilm);
    this.#sourcedMainFilms = updateItem(this.#sourcedMainFilms, updatedFilm);

    const renderedFilmsIndificators = this.#filmPresenter.keys();
    for (const renderedFilmId of renderedFilmsIndificators) {
      if (renderedFilmId === updatedFilm.id) {
        this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#comments[updatedFilm.id - 1]);
      }
    }

    const firstExtraFilmsIndificators = this.#filmPresenterFirstExtra.keys();
    for (const extraFilmId of firstExtraFilmsIndificators) {
      if (extraFilmId === updatedFilm.id) {
        this.#filmPresenterFirstExtra.get(updatedFilm.id).init(updatedFilm, this.#comments[updatedFilm.id - 1]);
      }
    }

    const secondExtraFilmsIndificators = this.#filmPresenterSecondExtra.keys();
    for (const extraFilmId of secondExtraFilmsIndificators) {
      if (extraFilmId === updatedFilm.id) {
        this.#filmPresenterSecondExtra.get(updatedFilm.id).init(updatedFilm, this.#comments[updatedFilm.id - 1]);
      }
    }
  };

  #updateFilmsListIfFilterActive = (filterType, filterData) => {
    if (this.#currentFilterType === filterType) {
      const renderedFilmsCount = this.#filmPresenter.size;

      if (filterData.length === this.#filmPresenter.size - 1) {
        this.#clearFilmsList();
        this.#renderFilteredFilmsConsideringSorting(filterData, renderedFilmsCount - 1);
      } else {
        this.#clearFilmsList();
        this.#renderFilteredFilmsConsideringSorting(filterData, renderedFilmsCount);
      }
    }
  };

  #handleFilterChange = (film, filter) => {
    switch (filter) {
      case FilterType.WATCHLIST:
        if (film.userDetails.watchlist) {
          this.#watchlistFilms.push(film);
          this.#updateFilmsListIfFilterActive(FilterType.WATCHLIST, this.#watchlistFilms);
        } else {
          this.#watchlistFilms = this.#watchlistFilms.filter((item) => item !== film);
          this.#updateFilmsListIfFilterActive(FilterType.WATCHLIST, this.#watchlistFilms);
        }
        break;

      case FilterType.WATCHED:
        if (film.userDetails.alreadyWatched) {
          this.#alreadyWatchedFilms.push(film);
          this.#updateFilmsListIfFilterActive(FilterType.WATCHED, this.#alreadyWatchedFilms);
        } else {
          this.#alreadyWatchedFilms = this.#alreadyWatchedFilms.filter((item) => item !== film);
          this.#updateFilmsListIfFilterActive(FilterType.WATCHED, this.#alreadyWatchedFilms);
        }
        break;

      case FilterType.FAVORITES:
        if (film.userDetails.favorite) {
          this.#favoriteFilms.push(film);
          this.#updateFilmsListIfFilterActive(FilterType.FAVORITES, this.#favoriteFilms);
        } else {
          this.#favoriteFilms = this.#favoriteFilms.filter((item) => item !== film);
          this.#updateFilmsListIfFilterActive(FilterType.FAVORITES, this.#favoriteFilms);
        }
        break;
    }

    const newNavigationComponent = new NavigationView(this.#watchlistFilms, this.#alreadyWatchedFilms, this.#favoriteFilms, this.#currentFilterType);

    replace(newNavigationComponent, this.#navigationComponent);
    this.#navigationComponent = newNavigationComponent;
    this.#navigationComponent.setClickHandler(this.#onFilterClick);
  };

  #renderFilm = (filmData, container) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#handlePopupStatusChange, this.#handleFilterChange);
    const filmComments = this.#comments[filmData.id - 1];
    filmPresenter.init(filmData, filmComments);

    switch (container) {
      case this.#filmsListContainerComponent.element:
        this.#filmPresenter.set(filmData.id, filmPresenter);
        break;
      case this.#firstExtraFilmsContainerComponent.element:
        this.#filmPresenterFirstExtra.set(filmData.id, filmPresenter);
        break;
      case this.#secondExtraFilmsContainerComponent.element:
        this.#filmPresenterSecondExtra.set(filmData.id, filmPresenter);
        break;
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

  #renderComponentsDependingOnFilmsPresence = (films) => {
    if (films.length === 0 && this.#filmsListContainerComponent.checkOnFilmsListPresence()) {
      this.#noFilmsComponent = new NoFilmsView(this.#currentFilterType);

      remove(this.#filmsListContainerComponent);
      replace(this.#noFilmsComponent, this.#filmsListSectionComponent);
      remove(this.#sortComponent);

      return;
    }

    if (films.length === 0 && this.#noFilmsComponent.element) {
      const newNoFilmsComponent = new NoFilmsView(this.#currentFilterType);

      replace(newNoFilmsComponent, this.#noFilmsComponent);
      remove(this.#sortComponent);
      this.#noFilmsComponent = newNoFilmsComponent;

      return;
    }

    if (films.length !== 0 && !this.#filmsListContainerComponent.checkOnFilmsListPresence()) {
      replace(this.#filmsListSectionComponent, this.#noFilmsComponent);
      render(this.#filmsListContainerComponent, this.#filmsListSectionComponent.element);
      this.#renderSort(this.#navigationComponent.element, RenderPosition.AFTEREND);

    }
  };

  #renderFilteredFilms = (filteredData, renderCount = RenderCount.FILM_CARDS) => {
    this.#renderComponentsDependingOnFilmsPresence(filteredData);

    this.#mainFilms = [...filteredData];
    this.#renderPartFilmCards(renderCount, this.#mainFilms);
  };

  #renderFilteredFilmsConsideringSorting = (filteredData, renderCount = RenderCount.FILM_CARDS) => {
    this.#renderComponentsDependingOnFilmsPresence(filteredData);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        this.#mainFilms = [...filteredData].sort((a, b) => formatDateToUnix(b.filmInfo.release.date) - formatDateToUnix(a.filmInfo.release.date));
        this.#renderPartFilmCards(renderCount, this.#mainFilms);
        break;
      case SortType.BY_RAITING:
        this.#mainFilms = [...filteredData].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        this.#renderPartFilmCards(renderCount, this.#mainFilms);
        break;
      default:
        this.#mainFilms = [...filteredData];
        this.#renderPartFilmCards(renderCount, this.#mainFilms);
    }
  };

  #onFilterClick = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }

    this.#currentFilterType = filterType;
    this.#navigationComponent.changeActiveElement(filterType);

    this.#clearFilmsList();

    switch (filterType) {
      case FilterType.WATCHLIST:
        this.#renderFilteredFilms(this.#watchlistFilms);
        break;

      case FilterType.WATCHED:
        this.#renderFilteredFilms(this.#alreadyWatchedFilms);
        break;

      case FilterType.FAVORITES:
        this.#renderFilteredFilms(this.#favoriteFilms);
        break;

      default:
        this.#renderFilteredFilms(this.#sourcedMainFilms);
    }

    this.#currentSortType = SortType.DEFAULT;
    this.#sortComponent.changeActiveElement(SortType.DEFAULT);
  };

  #onSortClick = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortComponent.changeActiveElement(this.#currentSortType);

    this.#clearFilmsList();

    switch (sortType) {
      case SortType.BY_DATE:
        this.#mainFilms.sort((a, b) => formatDateToUnix(b.filmInfo.release.date) - formatDateToUnix(a.filmInfo.release.date));
        this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#mainFilms);
        break;

      case SortType.BY_RAITING:
        this.#mainFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#mainFilms);
        break;

      default:
        switch (this.#currentFilterType) {
          case FilterType.WATCHLIST:
            this.#mainFilms = this.#sourcedMainFilms.filter((item) => item.userDetails.watchlist === true);
            break;
          case FilterType.WATCHED:
            this.#mainFilms = this.#sourcedMainFilms.filter((item) => item.userDetails.alreadyWatched === true);
            break;
          case FilterType.FAVORITES:
            this.#mainFilms = this.#sourcedMainFilms.filter((item) => item.userDetails.favorite === true);
            break;
          default:
            this.#mainFilms = [...this.#sourcedMainFilms];
        }

        this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.#mainFilms);
    }
  };
}
