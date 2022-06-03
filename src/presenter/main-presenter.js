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
import {FilterType, SortType, UserAction, UpdateType} from '../const.js';
import {filter} from '../utils/filter.js';
import {sortByDate, sortByRaiting, sortByCommentsCount} from '../utils/film.js';
import {RenderPosition} from '../framework/render.js';

const RenderCount = {
  FILM_CARDS: 5,
  FILM_CARDS_EXTRA: 2
};

const ExtraSection = {
  FIRST_TITLE: 'Top rated',
  FIRST_RENDERED: false,
  SECOND_TITLE: 'Most commented',
  SECOND_RENDERED: false
};

export default class MainPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #filmPresenter = new Map();
  #filmPresenterFirstExtra = new Map();
  #filmPresenterSecondExtra = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #extraSectionStatus = ExtraSection;
  #renderedFilmCardsCount = 0;

  #navigationComponent = null;
  #sortComponent = new SortView();
  #filmsSectionComponent = new FilmsSectionView();
  #noFilmsComponent = new NoFilmsView(this.#currentFilterType);
  #filmsListSectionComponent = new FilmsListSectionView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #firstExtraSectionComponent = new ExtraSectionView(ExtraSection.FIRST_TITLE);
  #secondExtraSectionComponent = new ExtraSectionView(ExtraSection.SECOND_TITLE);
  #firstExtraFilmsContainerComponent = new FilmsListContainerView();
  #secondExtraFilmsContainerComponent = new FilmsListContainerView();

  constructor (container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#renderedFilmCardsCount = 0;
    this.popupPresenter = new Map();
    this.popupComponent = new Map();

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get sourceFilms() {
    return [...this.#filmsModel.films];
  }

  get films() {
    const films = [...this.#filmsModel.films];
    const filteredFilms = filter[this.#currentFilterType](films);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.BY_RAITING:
        return filteredFilms.sort(sortByRaiting);
    }

    return filteredFilms;
  }

  get comments() {
    return [...this.#commentsModel.comments];
  }

  init = () => {
    this.#renderNavigation();
    this.#renderInitialFilmsLists();
  };

  #renderNavigation = () => {
    const newNavigationComponent = new NavigationView(this.sourceFilms, this.#currentFilterType);

    if (this.#navigationComponent === null) {
      this.#navigationComponent = newNavigationComponent;
      render(this.#navigationComponent, this.#container);
      this.#navigationComponent.setClickHandler(this.#onFilterClick);
      return;
    }

    replace(newNavigationComponent, this.#navigationComponent);
    this.#navigationComponent = newNavigationComponent;
    this.#navigationComponent.setClickHandler(this.#onFilterClick);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#navigationComponent.element, RenderPosition.AFTEREND);
    this.#sortComponent.setClickHandler(this.#onSortClick);
  };

  #renderInitialFilmsLists = () => {
    render(this.#filmsSectionComponent, this.#container);

    if (this.sourceFilms.length === 0) {
      this.#renderNoFilms();
    } else {
      this.#renderSort();
      render(this.#filmsListSectionComponent, this.#filmsSectionComponent.element);
      render(this.#filmsListContainerComponent, this.#filmsListSectionComponent.element);
      this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.sourceFilms);
      this.#renderExtra({first: true, second: true});
    }
  };

  #renderNoFilms = () => {
    render(this.#noFilmsComponent, this.#filmsSectionComponent.element);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        this.#handleFilmChange(data);
        this.#updateFilmsList({updateSecondExtra: true});
        break;
      case UpdateType.MAJOR:
        this.#handleFilmChange(data);
        this.#updateFilmsList();
        this.#renderNavigation();
        break;
    }
  };

  #changeFilm = (newFilm, filmPresenter) => {
    const renderedFilmsIndificators = filmPresenter.keys();

    for (const renderedFilmId of renderedFilmsIndificators) {
      if (renderedFilmId === newFilm.id) {
        filmPresenter.get(newFilm.id).init(newFilm, this.comments);
      }
    }
  };

  #handleFilmChange = (updatedFilm) => {
    this.#changeFilm(updatedFilm, this.#filmPresenter);
    this.#changeFilm(updatedFilm, this.#filmPresenterFirstExtra);
    this.#changeFilm(updatedFilm, this.#filmPresenterSecondExtra);

    if (this.popupPresenter.get(updatedFilm.id)) {
      this.popupPresenter.get(updatedFilm.id).init(updatedFilm, this.comments);
    }
  };

  #updateFilmsList = ({updateFirstExtra = false, updateSecondExtra = false} = {}) => {
    const renderedFilmsCount = this.#renderedFilmCardsCount;

    if (this.films.length === renderedFilmsCount - 1) {
      this.#updateFilteredFilms(renderedFilmsCount - 1);
    } else {
      this.#updateFilteredFilms(renderedFilmsCount);
    }

    if (updateFirstExtra) {
      if (this.sourceFilms.find((item) => item.filmInfo.totalRating > 0)) {
        if (this.#extraSectionStatus.FIRST_RENDERED) {
          this.#clearExtraFilmsList(this.#filmPresenterFirstExtra);

          for (let i = 0; i < Math.min(RenderCount.FILM_CARDS_EXTRA, this.sourceFilms.length); i++) {
            this.#renderFilm(this.sourceFilms.sort(sortByRaiting)[i], this.#firstExtraFilmsContainerComponent.element);
          }
        } else {
          this.#renderExtra({first: true});
        }
      } else {
        this.#clearExtraFilmsList(this.#filmPresenterFirstExtra);
        remove(this.#firstExtraSectionComponent);
        remove(this.#firstExtraFilmsContainerComponent);

        this.#extraSectionStatus = {...ExtraSection, FIRST_RENDERED: false};
      }
    }

    if (updateSecondExtra) {
      if (this.sourceFilms.find((item) => item.comments.length > 0)) {
        if (this.#extraSectionStatus.SECOND_RENDERED) {
          this.#clearExtraFilmsList(this.#filmPresenterSecondExtra);

          for (let i = 0; i < Math.min(RenderCount.FILM_CARDS_EXTRA, this.sourceFilms.length); i++) {
            this.#renderFilm(this.sourceFilms.sort(sortByCommentsCount)[i], this.#secondExtraFilmsContainerComponent.element);
          }
        } else {
          this.#renderExtra({second: true});
        }
      } else {
        this.#clearExtraFilmsList(this.#filmPresenterSecondExtra);
        remove(this.#secondExtraSectionComponent);
        remove(this.#secondExtraFilmsContainerComponent);

        this.#extraSectionStatus = {...ExtraSection, SECOND_RENDERED: false};
      }
    }
  };

  #renderFilm = (filmData, container) => {
    const filmPresenter = new FilmPresenter(
      container,
      this.#handleViewAction,
      this.popupPresenter,
      this.popupComponent
    );

    filmPresenter.init(filmData, this.comments);

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

    if (data.length === remainingFilmCardsCount && data.length > count && count >= RenderCount.FILM_CARDS) {
      this.#renderShowMoreButton(this.#filmsListSectionComponent.element);
      this.#showMoreButtonComponent.setClickHandler(() => this.#renderPartFilmCards(count, data));
    }
  };

  #renderExtra = ({first = false, second = false} = {}) => {
    if (first && this.sourceFilms.find((item) => item.filmInfo.totalRating > 0)) {
      render(this.#firstExtraSectionComponent, this.#filmsSectionComponent.element);
      render(this.#firstExtraFilmsContainerComponent, this.#firstExtraSectionComponent.element);

      this.#extraSectionStatus = {...ExtraSection, FIRST_RENDERED: true};

      for (let i = 0; i < Math.min(RenderCount.FILM_CARDS_EXTRA, this.sourceFilms.length); i++) {
        this.#renderFilm(this.sourceFilms.sort(sortByRaiting)[i], this.#firstExtraFilmsContainerComponent.element);
      }
    }

    if (second && this.sourceFilms.find((item) => item.comments.length > 0)) {
      render(this.#secondExtraSectionComponent, this.#filmsSectionComponent.element);
      render(this.#secondExtraFilmsContainerComponent, this.#secondExtraSectionComponent.element);

      this.#extraSectionStatus = {...ExtraSection, SECOND_RENDERED: true};

      for (let i = 0; i < Math.min(RenderCount.FILM_CARDS_EXTRA, this.sourceFilms.length); i++) {
        this.#renderFilm(this.sourceFilms.sort(sortByCommentsCount)[i], this.#secondExtraFilmsContainerComponent.element);
      }
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

  #clearExtraFilmsList = (extraPresenter) => {
    extraPresenter.forEach((item) => item.destroy());
    extraPresenter.clear();
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

  #updateFilteredFilms = (count) => {
    this.#clearFilmsList();
    this.#renderComponentsDependingOnFilmsPresence(this.films);
    this.#renderPartFilmCards(count, this.films);
  };

  #onFilterClick = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }

    this.#currentFilterType = filterType;
    this.#navigationComponent.changeActiveElement(filterType);

    this.#currentSortType = SortType.DEFAULT;
    this.#sortComponent.changeActiveElement(SortType.DEFAULT);

    this.#updateFilteredFilms(RenderCount.FILM_CARDS);
  };

  #onSortClick = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortComponent.changeActiveElement(this.#currentSortType);

    this.#clearFilmsList();
    this.#renderPartFilmCards(RenderCount.FILM_CARDS, this.films);
  };
}
