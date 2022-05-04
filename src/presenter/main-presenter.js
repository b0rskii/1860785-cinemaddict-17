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
import {render} from '../render.js';
import {fixScrollbarOpen, fixScrollbarClose} from '../util.js';

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
  #comments = [];
  #mainFilmsTopRateSorted = [];
  #mainFilmsMostCommentedSorted = [];
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
    this.#mainFilmsTopRateSorted = this.#mainFilms.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#mainFilmsMostCommentedSorted = this.#mainFilms.slice().sort((a, b) => b.commentsId.length - a.commentsId.length);

    render(new NavigationView(), this.#container);
    render(new SortView(), this.#container);
    render(this.#filmsSection, this.#container);

    if (this.#mainFilms.length === 0) {
      render(new NoFilmsView(), this.#filmsSection.element);
    } else {
      render(this.#filmsListSection, this.#filmsSection.element);
      render(this.#filmsListContainer, this.#filmsListSection.element);

      if (this.#mainFilms.length > RenderCount.FILM_CARDS) {
        this.#renderPartFilmCards(RenderCount.FILM_CARDS);
        render(this.#showMoreButton, this.#filmsListSection.element);

        this.#showMoreButton.element.addEventListener('click', () => {
          this.#renderPartFilmCards(RenderCount.FILM_CARDS);
        });
      } else {
        this.#renderPartFilmCards(this.#mainFilms.length);
      }

      render(this.#firstExtraSection, this.#filmsSection.element);
      render(this.#secondExtraSection, this.#filmsSection.element);
      render(this.#firstExtraFilmsContainer, this.#firstExtraSection.element);
      render(this.#secondExtraFilmsContainer, this.#secondExtraSection.element);

      for (let i = 0; i < Math.min(RenderCount.FILM_CARDS_EXTRA, this.#mainFilms.length); i++) {
        const firstExtrafilmCardComponent = new FilmCardView(this.#mainFilmsTopRateSorted[i]);
        const secondExtraFilmCardComponent = new FilmCardView(this.#mainFilmsMostCommentedSorted[i]);

        render(firstExtrafilmCardComponent, this.#firstExtraFilmsContainer.element);
        render(secondExtraFilmCardComponent, this.#secondExtraFilmsContainer.element);

        firstExtrafilmCardComponent.element.addEventListener('click', this.#onFilmCardClick);
        secondExtraFilmCardComponent.element.addEventListener('click', this.#onFilmCardClick);
      }
    }
  };

  #renderPartFilmCards = (count) => {
    const remainingFilmCardsCount = (this.#mainFilms.length - this.#renderedFilmCardsCount);
    let renderCount;

    if (remainingFilmCardsCount <= RenderCount.FILM_CARDS) {
      renderCount = remainingFilmCardsCount;
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    } else {
      renderCount = count;
    }

    for (let i = this.#renderedFilmCardsCount; i < renderCount + this.#renderedFilmCardsCount; i++) {
      const filmCardComponent = new FilmCardView(this.#mainFilms[i]);

      render(filmCardComponent, this.#filmsListContainer.element);

      filmCardComponent.element.addEventListener('click', this.#onFilmCardClick);
    }

    this.#renderedFilmCardsCount += renderCount;
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
      const popupComponent = new PopupView(this.#mainFilms[filmId], this.#comments);
      const body = document.querySelector('body');

      const renderPopup = () => {
        fixScrollbarOpen();
        render(popupComponent, body);
        body.classList.add('hide-overflow');

        const popupCloseButton = popupComponent.element.querySelector('.film-details__close-btn');

        popupCloseButton.addEventListener('click', () => {
          this.#closePopup(body);
        });

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
}
