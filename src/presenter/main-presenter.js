import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import ExtraSectionView from '../view/extra-section-view.js';
import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

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

  #filmsSection = new FilmsSectionView();
  #filmsListSection = new FilmsListSectionView();
  #filmsListContainer = new FilmsListContainerView();
  #firstExtraSection = new ExtraSectionView(Title.FIRST_EXTRA_SECTION);
  #secondExtraSection = new ExtraSectionView(Title.SECOND_EXTRA_SECTION);
  #topRatedFilmsContainer = new FilmsListContainerView();
  #mostCommentedFilmsContainer = new FilmsListContainerView();

  constructor (container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#mainFilms = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];

    render(new NavigationView(), this.#container);
    render(new SortView(), this.#container);
    render(this.#filmsSection, this.#container);
    render(this.#filmsListSection, this.#filmsSection.element);
    render(this.#filmsListContainer, this.#filmsListSection.element);

    for (let i = 0; i < RenderCount.FILM_CARDS; i++) {
      const filmCardComponent = new FilmCardView(this.#mainFilms[i]);

      render(filmCardComponent, this.#filmsListContainer.element);

      filmCardComponent.element.addEventListener('click', this.#onFilmCardClick);
    }

    render(new ShowMoreButtonView, this.#filmsListSection.element);
    render(this.#firstExtraSection, this.#filmsSection.element);
    render(this.#secondExtraSection, this.#filmsSection.element);
    render(this.#topRatedFilmsContainer, this.#firstExtraSection.element);
    render(this.#mostCommentedFilmsContainer, this.#secondExtraSection.element);

    for (let i = 0; i < RenderCount.FILM_CARDS_EXTRA; i++) {
      render(new FilmCardView(this.#mainFilms[i]), this.#topRatedFilmsContainer.element);
      render(new FilmCardView(this.#mainFilms[i]), this.#mostCommentedFilmsContainer.element);
    }
  };

  #closePopup = (body) => {
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
    const filmId = evt.target.getAttribute('data-id') - 1;
    const popupComponent = new PopupView(this.#mainFilms[filmId], this.#comments);
    const body = document.querySelector('body');

    const renderPopup = () => {
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
  };
}
